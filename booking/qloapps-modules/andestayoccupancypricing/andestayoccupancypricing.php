<?php
/**
 * AndeStay Occupancy Pricing — occupancy-based overnight overrides.
 *
 * Configurable exact (adults, children) rules for selected room types.
 * Typical AndeStay matrix:
 *   Double 1A/0C → 55; Triple 1A/0C → 55; Triple 2A/0C → 110.
 * Everything else (Simple, Matrimonial, Triple 3A, children, missing occupancy)
 * leaves QloApps core pricing untouched.
 *
 * @author AndeStay
 * @license AFL-3.0
 */

if (!defined('_PS_VERSION_')) {
    exit;
}

require_once dirname(__FILE__).'/classes/AndestayOccupancyPricingRepository.php';
require_once dirname(__FILE__).'/classes/AndestayOccupancyPriceService.php';

class AndeStayOccupancyPricing extends Module
{
    const CONFIG_ENABLED = 'ANDESTAY_OCC_ENABLED';
    const CONFIG_DEBUG = 'ANDESTAY_OCC_DEBUG';
    const CONFIG_DEFAULT_SOLO_PRICE = 'ANDESTAY_OCC_SOLO_PRICE_TE';
    const CONFIG_DEFAULT_DUAL_PRICE = 'ANDESTAY_OCC_DUAL_PRICE_TE';
    const DEFAULT_SOLO_PRICE_TE = 55.0;
    const DEFAULT_DUAL_PRICE_TE = 110.0;

    public function __construct()
    {
        $this->name = 'andestayoccupancypricing';
        $this->tab = 'pricing_promotion';
        $this->version = '1.0.1';
        $this->author = 'AndeStay';
        $this->need_instance = 0;
        $this->bootstrap = true;
        $this->ps_versions_compliancy = array('min' => '1.6', 'max' => _PS_VERSION_);

        parent::__construct();

        $this->displayName = $this->l('AndeStay Occupancy Pricing');
        $this->description = $this->l(
            'Applies special overnight prices for exact occupancy (e.g. Triple 1–2 adults). All other cases keep QloApps core pricing.'
        );
        $this->confirmUninstall = $this->l('Remove AndeStay Occupancy Pricing configuration and rules?');
    }

    public function install()
    {
        return parent::install()
            && $this->registerHook('actionRoomTypeTotalPriceModifier')
            && $this->installDb()
            && Configuration::updateValue(self::CONFIG_ENABLED, 0)
            && Configuration::updateValue(self::CONFIG_DEBUG, 0)
            && Configuration::updateValue(self::CONFIG_DEFAULT_SOLO_PRICE, self::DEFAULT_SOLO_PRICE_TE)
            && Configuration::updateValue(self::CONFIG_DEFAULT_DUAL_PRICE, self::DEFAULT_DUAL_PRICE_TE);
    }

    public function uninstall()
    {
        $this->uninstallDb();
        Configuration::deleteByName(self::CONFIG_ENABLED);
        Configuration::deleteByName(self::CONFIG_DEBUG);
        Configuration::deleteByName(self::CONFIG_DEFAULT_SOLO_PRICE);
        Configuration::deleteByName(self::CONFIG_DEFAULT_DUAL_PRICE);

        return parent::uninstall();
    }

    protected function installDb()
    {
        $sql = 'CREATE TABLE IF NOT EXISTS `'._DB_PREFIX_.'andestay_occupancy_rule` (
            `id_rule` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
            `id_product` INT(10) UNSIGNED NOT NULL,
            `id_hotel` INT(10) UNSIGNED NOT NULL DEFAULT 0,
            `adults` INT(10) UNSIGNED NOT NULL DEFAULT 1,
            `children` INT(10) UNSIGNED NOT NULL DEFAULT 0,
            `price_te` DECIMAL(20,6) NOT NULL DEFAULT 0.000000,
            `active` TINYINT(1) UNSIGNED NOT NULL DEFAULT 0,
            `date_add` DATETIME NOT NULL,
            `date_upd` DATETIME NOT NULL,
            PRIMARY KEY (`id_rule`),
            UNIQUE KEY `uniq_room_occ` (`id_product`, `adults`, `children`)
        ) ENGINE='._MYSQL_ENGINE_.' DEFAULT CHARSET=utf8;';

        return Db::getInstance()->execute($sql);
    }

    protected function uninstallDb()
    {
        return Db::getInstance()->execute(
            'DROP TABLE IF EXISTS `'._DB_PREFIX_.'andestay_occupancy_rule`'
        );
    }

    /**
     * QloApps pricing extension point — see HotelRoomTypeFeaturePricing::getRoomTypeTotalPrice().
     *
     * @param array $params
     */
    public function hookActionRoomTypeTotalPriceModifier($params)
    {
        if (!$this->active) {
            return;
        }

        $service = new AndestayOccupancyPriceService($this);
        $service->applyOccupancyOverride($params);
    }

    public function getContent()
    {
        $output = '';

        if (Tools::isSubmit('submitAndestayOccupancyPricing')) {
            $output .= $this->postProcess();
        }

        $output .= $this->renderForm();

        return $output;
    }

    protected function postProcess()
    {
        // AdminModules already requires employee module permission; also verify CSRF token.
        $token = Tools::getValue('token');
        if (!$token || $token !== Tools::getAdminTokenLite('AdminModules')) {
            return $this->displayError($this->l('Invalid security token.'));
        }

        $enabled = (int) Tools::getValue(self::CONFIG_ENABLED);
        $debug = (int) Tools::getValue(self::CONFIG_DEBUG);
        $soloPriceRaw = str_replace(',', '.', trim((string) Tools::getValue(self::CONFIG_DEFAULT_SOLO_PRICE)));
        $dualPriceRaw = str_replace(',', '.', trim((string) Tools::getValue(self::CONFIG_DEFAULT_DUAL_PRICE)));

        if ($soloPriceRaw === '' || !is_numeric($soloPriceRaw) || (float) $soloPriceRaw < 0) {
            return $this->displayError($this->l('1-adult price must be a valid non-negative number.'));
        }
        if ($dualPriceRaw === '' || !is_numeric($dualPriceRaw) || (float) $dualPriceRaw < 0) {
            return $this->displayError($this->l('2-adult price must be a valid non-negative number.'));
        }

        $soloPrice = (float) $soloPriceRaw;
        $dualPrice = (float) $dualPriceRaw;

        Configuration::updateValue(self::CONFIG_ENABLED, $enabled ? 1 : 0);
        Configuration::updateValue(self::CONFIG_DEBUG, $debug ? 1 : 0);
        Configuration::updateValue(self::CONFIG_DEFAULT_SOLO_PRICE, $soloPrice);
        Configuration::updateValue(self::CONFIG_DEFAULT_DUAL_PRICE, $dualPrice);

        $repo = new AndestayOccupancyPricingRepository();
        $roomTypes = $repo->getRoomTypesForConfig();
        $now = date('Y-m-d H:i:s');

        foreach ($roomTypes as $roomType) {
            $idProduct = (int) $roomType['id_product'];
            $idHotel = (int) $roomType['id_hotel'];
            $soloActive = (int) Tools::getValue('solo_active_'.$idProduct);
            $dualActive = (int) Tools::getValue('dual_active_'.$idProduct);

            $repo->upsertRule($idProduct, $idHotel, 1, 0, $soloPrice, $soloActive ? 1 : 0, $now);
            $repo->upsertRule($idProduct, $idHotel, 2, 0, $dualPrice, $dualActive ? 1 : 0, $now);
        }

        if (method_exists('Tools', 'clearSmartyCache')) {
            Tools::clearSmartyCache();
        }
        if (class_exists('Cache') && method_exists('Cache', 'clean')) {
            Cache::clean('*');
        }

        return $this->displayConfirmation($this->l('Settings updated.'));
    }

    protected function renderForm()
    {
        $repo = new AndestayOccupancyPricingRepository();
        $roomTypes = $repo->getRoomTypesForConfig();
        $soloByProduct = $repo->getRulesIndexedByProduct(1, 0);
        $dualByProduct = $repo->getRulesIndexedByProduct(2, 0);

        $inputs = array(
            array(
                'type' => 'switch',
                'label' => $this->l('Enable occupancy pricing'),
                'name' => self::CONFIG_ENABLED,
                'is_bool' => true,
                'values' => array(
                    array('id' => 'occ_on', 'value' => 1, 'label' => $this->l('Yes')),
                    array('id' => 'occ_off', 'value' => 0, 'label' => $this->l('No')),
                ),
                'desc' => $this->l(
                    'When disabled, QloApps core prices are used for every room type and occupancy.'
                ),
            ),
            array(
                'type' => 'text',
                'label' => $this->l('1-adult price (tax excl., default currency)'),
                'name' => self::CONFIG_DEFAULT_SOLO_PRICE,
                'class' => 'fixed-width-sm',
                'desc' => $this->l(
                    'Amount in the shop default currency (AndeStay: PEN / S/). Converted via Tools::convertPrice for other FO currencies. Used when a room type has the 1 adult / 0 children rule enabled.'
                ),
            ),
            array(
                'type' => 'text',
                'label' => $this->l('2-adult price (tax excl., default currency)'),
                'name' => self::CONFIG_DEFAULT_DUAL_PRICE,
                'class' => 'fixed-width-sm',
                'desc' => $this->l(
                    'Used when a room type has the 2 adults / 0 children rule enabled (AndeStay Triple → 110). Leave disabled on Double so core 110 is used.'
                ),
            ),
            array(
                'type' => 'switch',
                'label' => $this->l('Diagnostic log'),
                'name' => self::CONFIG_DEBUG,
                'is_bool' => true,
                'values' => array(
                    array('id' => 'dbg_on', 'value' => 1, 'label' => $this->l('Yes')),
                    array('id' => 'dbg_off', 'value' => 0, 'label' => $this->l('No')),
                ),
                'desc' => $this->l('Logs technical pricing decisions without personal data. Off by default.'),
            ),
        );

        foreach ($roomTypes as $roomType) {
            $idProduct = (int) $roomType['id_product'];
            $labelBase = sprintf(
                '%s (id_product=%d, hotel=%d, max_adults=%d, base=%s)',
                $roomType['name'],
                $idProduct,
                (int) $roomType['id_hotel'],
                (int) $roomType['max_adults'],
                isset($roomType['base_price']) ? $roomType['base_price'] : '-'
            );
            $inputs[] = array(
                'type' => 'switch',
                'label' => $labelBase.' — '.$this->l('1 adult / 0 children'),
                'name' => 'solo_active_'.$idProduct,
                'is_bool' => true,
                'values' => array(
                    array('id' => 'solo_'.$idProduct.'_on', 'value' => 1, 'label' => $this->l('Yes')),
                    array('id' => 'solo_'.$idProduct.'_off', 'value' => 0, 'label' => $this->l('No')),
                ),
                'desc' => $this->l('Enable special 1-adult overnight price for this room type. Leave OFF for Simple and Matrimonial.'),
            );
            $inputs[] = array(
                'type' => 'switch',
                'label' => $labelBase.' — '.$this->l('2 adults / 0 children'),
                'name' => 'dual_active_'.$idProduct,
                'is_bool' => true,
                'values' => array(
                    array('id' => 'dual_'.$idProduct.'_on', 'value' => 1, 'label' => $this->l('Yes')),
                    array('id' => 'dual_'.$idProduct.'_off', 'value' => 0, 'label' => $this->l('No')),
                ),
                'desc' => $this->l('Enable special 2-adult overnight price (AndeStay: Triple only). Leave OFF for Double, Simple, Matrimonial.'),
            );
        }

        if (!$roomTypes) {
            $inputs[] = array(
                'type' => 'html',
                'name' => 'no_rooms',
                'html_content' => '<div class="alert alert-warning">'
                    .$this->l('No room types found. Create room types in Catalog first.')
                    .'</div>',
            );
        }

        $helper = new HelperForm();
        $helper->show_toolbar = false;
        $helper->table = $this->table;
        $helper->module = $this;
        $helper->default_form_language = (int) $this->context->language->id;
        $helper->allow_employee_form_lang = (int) Configuration::get('PS_BO_ALLOW_EMPLOYEE_FORM_LANG');
        $helper->identifier = $this->identifier;
        $helper->submit_action = 'submitAndestayOccupancyPricing';
        $helper->currentIndex = $this->context->link->getAdminLink('AdminModules', false)
            .'&configure='.$this->name.'&tab_module='.$this->tab.'&module_name='.$this->name;
        $helper->token = Tools::getAdminTokenLite('AdminModules');

        $dualPrice = Configuration::get(self::CONFIG_DEFAULT_DUAL_PRICE);
        if ($dualPrice === false || $dualPrice === null || $dualPrice === '') {
            $dualPrice = self::DEFAULT_DUAL_PRICE_TE;
        }

        $fieldsValue = array(
            self::CONFIG_ENABLED => (int) Configuration::get(self::CONFIG_ENABLED),
            self::CONFIG_DEBUG => (int) Configuration::get(self::CONFIG_DEBUG),
            self::CONFIG_DEFAULT_SOLO_PRICE => Configuration::get(self::CONFIG_DEFAULT_SOLO_PRICE),
            self::CONFIG_DEFAULT_DUAL_PRICE => $dualPrice,
        );
        foreach ($roomTypes as $roomType) {
            $idProduct = (int) $roomType['id_product'];
            $fieldsValue['solo_active_'.$idProduct] = isset($soloByProduct[$idProduct])
                ? (int) $soloByProduct[$idProduct]['active']
                : 0;
            $fieldsValue['dual_active_'.$idProduct] = isset($dualByProduct[$idProduct])
                ? (int) $dualByProduct[$idProduct]['active']
                : 0;
        }

        $helper->tpl_vars = array(
            'fields_value' => $fieldsValue,
            'languages' => $this->context->controller->getLanguages(),
            'id_language' => $this->context->language->id,
        );

        $form = array(
            'form' => array(
                'legend' => array(
                    'title' => $this->l('AndeStay Occupancy Pricing'),
                    'icon' => 'icon-money',
                ),
                'description' => $this->l(
                    'AndeStay: enable 1-adult on Double+Triple, and 2-adult only on Triple. Simple/Matrimonial stay on core prices. Triple 3 adults stays on core 160. Leave global enable OFF until rules are configured.'
                ),
                'input' => $inputs,
                'submit' => array(
                    'title' => $this->l('Save'),
                ),
            ),
        );

        return $helper->generateForm(array($form));
    }
}
