<?php
/**
 * Pay at Property / Cash at Hotel — offline payment module for QloApps 1.7.0.0
 *
 * Based on the same PaymentModule + validateOrder flow as bankwire / cheque.
 * Creates bookings without online payment; guest pays at the property.
 *
 * @author AndeStay
 * @license AFL-3.0
 */

if (!defined('_PS_VERSION_')) {
    exit;
}

class PayAtProperty extends PaymentModule
{
    const CONFIG_ORDER_STATE = 'PAYATPROPERTY_OS_AWAITING';
    const CONFIG_NOTIFICATION_EMAIL = 'PAYATPROPERTY_NOTIFICATION_EMAIL';
    const MAIL_TEMPLATE = 'pay_at_property';
    const MAIL_TEMPLATE_ADMIN = 'new_booking_admin';
    const MAIL_TEMPLATE_ORDER_CONF = 'order_conf';
    const DEFAULT_NOTIFICATION_EMAIL = 'andestayhostel@gmail.com';
    const ADMIN_NOTIFIED_MARKER = '[payatproperty_admin_notified]';

    protected $_html = '';

    public function __construct()
    {
        $this->name = 'payatproperty';
        $this->tab = 'payments_gateways';
        $this->version = '1.1.4';
        $this->author = 'AndeStay';
        $this->controllers = array('payment', 'validation');
        $this->currencies = true;
        $this->currencies_mode = 'checkbox';
        $this->bootstrap = true;
        $this->ps_versions_compliancy = array('min' => '1.6', 'max' => _PS_VERSION_);

        parent::__construct();

        $this->displayName = $this->l('Pay at property');
        $this->description = $this->l('Pay in cash when you arrive at the property.');
        $this->confirmUninstall = $this->l('Are you sure you want to uninstall this module?');

        // checkPaymentCurrencies() may return false (e.g. before install / no currencies linked)
        $currencies = Currency::checkPaymentCurrencies($this->id);
        if (!$currencies || !count($currencies)) {
            $this->warning = $this->l('No currency has been set for this module.');
        }

        // Offline / remote-style payment (same family as cheque / bankwire)
        $this->payment_type = OrderPayment::PAYMENT_TYPE_REMOTE_PAYMENT;
    }

    public function install()
    {
        if (!parent::install()
            || !$this->registerHook('displayPayment')
            || !$this->registerHook('payment')
            || !$this->registerHook('displayPaymentEU')
            || !$this->registerHook('paymentReturn')
            || !$this->registerHook('displayPaymentReturn')
            || !$this->registerHook('actionEmailAddAfterContent')
            || !$this->installOrderState()
            || !$this->installMailLogo()
            || !$this->installMailTemplates()
            || !Configuration::updateValue(
                self::CONFIG_NOTIFICATION_EMAIL,
                self::DEFAULT_NOTIFICATION_EMAIL
            )
        ) {
            return false;
        }

        return true;
    }

    public function uninstall()
    {
        // Keep OrderState for historical orders; remove only our Configuration keys.
        Configuration::deleteByName(self::CONFIG_ORDER_STATE);
        Configuration::deleteByName(self::CONFIG_NOTIFICATION_EMAIL);

        return parent::uninstall();
    }

    /**
     * Ensure notification email config exists after zip upgrade (install() may not re-run).
     */
    protected function ensureNotificationEmailConfig()
    {
        $current = Configuration::get(self::CONFIG_NOTIFICATION_EMAIL);
        if ($current === false || $current === null) {
            Configuration::updateValue(
                self::CONFIG_NOTIFICATION_EMAIL,
                self::DEFAULT_NOTIFICATION_EMAIL
            );
        }
    }

    /**
     * Create custom unpaid order state and store its ID in Configuration.
     *
     * @return bool
     */
    protected function installOrderState()
    {
        $existingId = (int) Configuration::get(self::CONFIG_ORDER_STATE);
        if ($existingId) {
            $existing = new OrderState($existingId);
            if (Validate::isLoadedObject($existing)) {
                return true;
            }
        }

        $orderState = new OrderState();
        $orderState->send_email = 1;
        $orderState->module_name = $this->name;
        $orderState->invoice = 0;
        $orderState->color = '#9C27B0';
        $orderState->logable = 0;
        $orderState->delivery = 0;
        $orderState->shipped = 0;
        $orderState->paid = 0;
        $orderState->pdf_invoice = 0;
        $orderState->pdf_delivery = 0;
        $orderState->hidden = 0;
        $orderState->unremovable = 0;

        $names = array(
            'en' => 'Awaiting payment at property',
            'cs' => 'Čeká na platbu na místě',
            'es' => 'Pendiente de pago en el alojamiento',
        );

        $languages = Language::getLanguages(false);
        if (!is_array($languages)) {
            $languages = array();
        }
        foreach ($languages as $language) {
            $iso = Tools::strtolower($language['iso_code']);
            $orderState->name[(int) $language['id_lang']] = isset($names[$iso])
                ? $names[$iso]
                : $names['en'];
            $orderState->template[(int) $language['id_lang']] = self::MAIL_TEMPLATE;
        }

        if (!$orderState->add()) {
            return false;
        }

        // Optional icon (reuse module logo if available)
        $source = _PS_MODULE_DIR_.$this->name.'/logo.gif';
        $dest = _PS_ORDER_STATE_IMG_DIR_.(int) $orderState->id.'.gif';
        if (file_exists($source) && is_writable(_PS_ORDER_STATE_IMG_DIR_)) {
            @copy($source, $dest);
        }

        return Configuration::updateValue(self::CONFIG_ORDER_STATE, (int) $orderState->id);
    }

    /**
     * Install a small dedicated email logo (PS_LOGO_MAIL).
     *
     * Shop header logo is ~1254×1254 px. Stock QloApps mail templates use
     * <img src="{shop_logo}"> without width, so Gmail shows it at natural size.
     * A 100×100 source file keeps every mail compact even if HTML attrs are missing.
     *
     * @return bool
     */
    public function installMailLogo()
    {
        $src = dirname(__FILE__).'/mails/andestay-mail-logo.png';
        if (!file_exists($src) || !is_dir(_PS_IMG_DIR_) || !is_writable(_PS_IMG_DIR_)) {
            return true; // non-fatal — hook/templates still constrain size
        }

        $destName = 'andestay-mail-logo.png';
        $dest = _PS_IMG_DIR_.$destName;
        if (!@copy($src, $dest)) {
            return true;
        }

        Configuration::updateValue('PS_LOGO_MAIL', $destName);

        return true;
    }

    /**
     * Force logo size in every outgoing HTML mail (runs before {shop_logo} substitution).
     * Covers stock templates that never got upgraded on disk.
     *
     * @param array $params
     */
    public function hookActionEmailAddAfterContent($params)
    {
        if (empty($params['template_html']) || !is_string($params['template_html'])) {
            return;
        }

        $logoImg = '<img src="{shop_logo}" alt="{shop_name}" width="100" height="100" border="0"'
            .' style="width:100px !important;max-width:100px !important;height:100px !important;'
            .'display:block;margin:0 auto;border:0;outline:none;text-decoration:none;'
            .'-ms-interpolation-mode:bicubic;">';

        $html = $params['template_html'];
        $html = preg_replace(
            '/<img\b[^>]*\{shop_logo\}[^>]*>/i',
            $logoImg,
            $html
        );
        // Rare stock layouts put the token alone (no <img>)
        if (strpos($html, '{shop_logo}') !== false && strpos($html, 'src="{shop_logo}"') === false) {
            $html = str_replace('{shop_logo}', $logoImg, $html);
        }

        $params['template_html'] = $html;
    }

    /**
     * Copy mail templates into shop mails/{iso}/ for languages that exist.
     * Public so upgrades / BO Save can re-sync responsive templates (e.g. order_conf).
     *
     * @return bool
     */
    public function installMailTemplates()
    {
        $languages = Language::getLanguages(false);
        if (!is_array($languages)) {
            $languages = array();
        }
        $templates = array(
            self::MAIL_TEMPLATE,
            self::MAIL_TEMPLATE_ADMIN,
            self::MAIL_TEMPLATE_ORDER_CONF,
        );
        foreach ($languages as $language) {
            $iso = Tools::strtolower($language['iso_code']);
            $sourceIso = in_array($iso, array('en', 'cs', 'es'), true) ? $iso : 'en';
            $srcDir = _PS_MODULE_DIR_.$this->name.'/mails/'.$sourceIso.'/';
            $destDir = _PS_MAIL_DIR_.$iso.'/';

            if (!is_dir($destDir)) {
                continue;
            }

            foreach ($templates as $template) {
                foreach (array('.html', '.txt', '.tpl') as $ext) {
                    $src = $srcDir.$template.$ext;
                    $dest = $destDir.$template.$ext;
                    if (file_exists($src)) {
                        @copy($src, $dest);
                    }
                }
            }

            // Partial Smarty mail blocks used inside order_conf ({cart_booking_data_html}, …)
            foreach (array('hotel_booking_cart_data', 'booking_extra_demands') as $partial) {
                $src = $srcDir.$partial.'.tpl';
                $dest = $destDir.$partial.'.tpl';
                if (file_exists($src)) {
                    @copy($src, $dest);
                }
            }

            // Theme mail overrides win over /mails/ in some QloApps setups — keep them in sync.
            $themeMailDir = _PS_THEME_DIR_.'mails/'.$iso.'/';
            if (is_dir($themeMailDir)) {
                foreach ($templates as $template) {
                    foreach (array('.html', '.txt') as $ext) {
                        $src = $srcDir.$template.$ext;
                        $dest = $themeMailDir.$template.$ext;
                        if (file_exists($src)) {
                            @copy($src, $dest);
                        }
                    }
                }
                foreach (array('hotel_booking_cart_data', 'booking_extra_demands') as $partial) {
                    $src = $srcDir.$partial.'.tpl';
                    $dest = $themeMailDir.$partial.'.tpl';
                    if (file_exists($src)) {
                        @copy($src, $dest);
                    }
                }
            }
        }

        return true;
    }

    public function getContent()
    {
        $this->ensureNotificationEmailConfig();
        $this->_html = '';

        if (Tools::isSubmit('btnSubmit')) {
            $this->_html .= $this->postProcess();
            // Re-sync small mail logo + templates (incl. order_conf) into shop mails/
            $this->installMailLogo();
            $this->installMailTemplates();
        }

        $this->_html .= $this->display(__FILE__, 'infos.tpl');
        $this->_html .= $this->renderInfoForm();

        return $this->_html;
    }

    /**
     * Save BO settings (notification email is optional).
     *
     * @return string HTML feedback
     */
    protected function postProcess()
    {
        $email = trim((string) Tools::getValue(self::CONFIG_NOTIFICATION_EMAIL));

        if ($email === '') {
            Configuration::updateValue(self::CONFIG_NOTIFICATION_EMAIL, '');

            return $this->displayConfirmation($this->l('Settings updated'));
        }

        if (!Validate::isEmail($email)) {
            return $this->displayError(
                $this->l('Please enter a valid email address or leave the field empty.')
            );
        }

        Configuration::updateValue(self::CONFIG_NOTIFICATION_EMAIL, $email);

        return $this->displayConfirmation($this->l('Settings updated'));
    }

    protected function renderInfoForm()
    {
        $idState = (int) Configuration::get(self::CONFIG_ORDER_STATE);
        $stateName = '-';
        if ($idState) {
            $state = new OrderState($idState, (int) $this->context->language->id);
            if (Validate::isLoadedObject($state)) {
                $stateName = $state->name;
            }
        }

        $fields_form = array(
            'form' => array(
                'legend' => array(
                    'title' => $this->l('Pay at property'),
                    'icon' => 'icon-money',
                ),
                'description' => sprintf(
                    $this->l('Order status used by this module: %s (ID %d). Reception can change the order to Payment accepted after cash is received.'),
                    $stateName,
                    $idState
                ),
                'input' => array(
                    array(
                        'type' => 'text',
                        'label' => $this->l('Booking notification email'),
                        'name' => self::CONFIG_NOTIFICATION_EMAIL,
                        'desc' => $this->l(
                            'Send an email notification to the property when a new Pay at Property booking is created.'
                        ),
                        'required' => false,
                        'class' => 'fixed-width-xxl',
                    ),
                ),
                'submit' => array(
                    'title' => $this->l('Save'),
                ),
            ),
        );

        $helper = new HelperForm();
        $helper->show_toolbar = false;
        $helper->table = $this->table;
        $helper->module = $this;
        $helper->default_form_language = (int) $this->context->language->id;
        $helper->allow_employee_form_lang = (int) Configuration::get('PS_BO_ALLOW_EMPLOYEE_FORM_LANG');
        $helper->identifier = $this->identifier;
        $helper->submit_action = 'btnSubmit';
        $helper->currentIndex = $this->context->link->getAdminLink('AdminModules', false)
            .'&configure='.$this->name.'&tab_module='.$this->tab.'&module_name='.$this->name;
        $helper->token = Tools::getAdminTokenLite('AdminModules');
        $helper->tpl_vars = array(
            'fields_value' => array(
                self::CONFIG_NOTIFICATION_EMAIL => Configuration::get(self::CONFIG_NOTIFICATION_EMAIL),
            ),
            'languages' => $this->context->controller->getLanguages(),
            'id_language' => $this->context->language->id,
        );

        return $helper->generateForm(array($fields_form));
    }

    /**
     * QloApps 1.7 checkout uses displayPayment (bankwire still registers payment via alias).
     */
    public function hookDisplayPayment($params)
    {
        return $this->hookPayment($params);
    }

    public function hookPayment($params)
    {
        if (!$this->active) {
            return;
        }
        if (!$this->checkCurrency($params['cart'])) {
            return;
        }
        if (!$this->isCartBookable($params['cart'])) {
            return;
        }

        $this->smarty->assign(array(
            'this_path' => $this->_path,
            'this_path_ssl' => Tools::getShopDomainSsl(true, true).__PS_BASE_URI__.'modules/'.$this->name.'/',
        ));

        return $this->display(__FILE__, 'payment.tpl');
    }

    public function hookDisplayPaymentEU($params)
    {
        if (!$this->active || !$this->checkCurrency($params['cart']) || !$this->isCartBookable($params['cart'])) {
            return;
        }

        return array(
            'cta_text' => $this->l('Pay at property'),
            'logo' => Media::getMediaPath(dirname(__FILE__).'/payatproperty.jpg'),
            'action' => $this->context->link->getModuleLink($this->name, 'validation', array(), true),
        );
    }

    public function hookDisplayPaymentReturn($params)
    {
        return $this->hookPaymentReturn($params);
    }

    public function hookPaymentReturn($params)
    {
        if (!$this->active) {
            return;
        }

        /** @var Order $objOrder */
        $objOrder = $params['objOrder'];
        $idOrderState = (int) $objOrder->getCurrentState();
        $awaitingId = (int) Configuration::get(self::CONFIG_ORDER_STATE);

        $objOrderState = new OrderState($idOrderState);
        $history = $objOrder->getHistory($this->context->language->id);
        $initialStatus = is_array($history) ? array_pop($history) : null;

        $ok = ($idOrderState === $awaitingId)
            || (
                Validate::isLoadedObject($objOrderState)
                && $objOrderState->logable
                && is_array($initialStatus)
                && (int) $initialStatus['id_order_state'] === $awaitingId
            );

        $smartyVars = array('status' => 'failed');

        if ($ok) {
            $objCart = new Cart($objOrder->id_cart);
            if (!empty($objCart->is_advance_payment)) {
                $cartTotal = $objOrder->getOrdersTotalPaid(1);
            } else {
                $cartTotal = $objOrder->getOrdersTotalPaid();
            }

            $cartRoomBookings = array();
            if (class_exists('HotelBookingDetail')) {
                $objHotelBooking = new HotelBookingDetail();
                if (method_exists($objHotelBooking, 'getBookingDataByOrderReference')) {
                    $cartRoomBookings = $objHotelBooking->getBookingDataByOrderReference($objOrder->reference);
                }
            }

            $smartyVars = array(
                'status' => 'ok',
                'cart_room_bookings' => $cartRoomBookings,
                'total_to_pay' => Tools::displayPrice(
                    $cartTotal,
                    isset($params['currencyObj']) ? $params['currencyObj'] : $this->context->currency,
                    false
                ),
                'id_order' => $objOrder->id,
                'reference' => $objOrder->reference,
            );
        }

        $this->smarty->assign($smartyVars);

        return $this->display(__FILE__, 'payment_return.tpl');
    }

    /**
     * Extra content for status mails when our state is used (if core passes module hook).
     */
    public function getExtraMailContent($id_order_state, $order)
    {
        if ((int) Configuration::get(self::CONFIG_ORDER_STATE) !== (int) $id_order_state) {
            return array();
        }

        $this->context->smarty->assign(array(
            'lang' => new Language($order->id_lang),
            'total_paid' => Tools::displayPrice($order->total_paid, $this->context->currency, false),
        ));

        return array(
            '{extra_mail_content_html}' => $this->context->smarty->fetch(
                $this->local_path.'views/templates/mail/mail_template_html.tpl'
            ),
            '{extra_mail_content_txt}' => $this->context->smarty->fetch(
                $this->local_path.'views/templates/mail/mail_template_text.tpl'
            ),
        );
    }

    public function checkCurrency($cart)
    {
        $currency_order = new Currency((int) $cart->id_currency);
        $currencies_module = $this->getCurrency((int) $cart->id_currency);

        if (is_array($currencies_module)) {
            foreach ($currencies_module as $currency_module) {
                if ((int) $currency_order->id === (int) $currency_module['id_currency']) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Show method only for non-empty carts with a positive total.
     *
     * @param Cart $cart
     *
     * @return bool
     */
    public function isCartBookable($cart)
    {
        if (!Validate::isLoadedObject($cart) || !(int) $cart->id) {
            return false;
        }
        if ((int) $cart->nbProducts() <= 0) {
            return false;
        }

        if (!empty($cart->is_advance_payment)) {
            $total = (float) $cart->getOrderTotal(true, Cart::ADVANCE_PAYMENT);
        } else {
            $total = (float) $cart->getOrderTotal(true, Cart::BOTH);
        }

        return $total > 0;
    }

    /**
     * Order state ID created at install.
     *
     * @return int
     */
    public function getOrderStateId()
    {
        return (int) Configuration::get(self::CONFIG_ORDER_STATE);
    }

    /**
     * Send confirmation mail for our custom state (core only auto-mails PS_OS_AWAITING_*).
     *
     * @param Order $order
     * @param Customer $customer
     * @param array $extraVars
     */
    public function sendPayAtPropertyMail(Order $order, Customer $customer, array $extraVars = array())
    {
        if ((float) $order->total_paid <= 0) {
            return;
        }

        $idLang = (int) $order->id_lang;
        $templateVars = array_merge(array(
            '{firstname}' => $customer->firstname,
            '{lastname}' => $customer->lastname,
            '{order_name}' => $order->getUniqReference(),
            '{payment_method}' => $this->displayName,
            '{total_paid}' => Tools::displayPrice($order->total_paid, new Currency((int) $order->id_currency), false),
            '{shop_name}' => Configuration::get('PS_SHOP_NAME'),
            '{shop_url}' => Context::getContext()->link->getPageLink('index', true, $idLang),
            '{history_url}' => Context::getContext()->link->getPageLink('history', true, $idLang),
            '{my_account_url}' => Context::getContext()->link->getPageLink('my-account', true, $idLang),
            '{guest_tracking_url}' => Context::getContext()->link->getPageLink('guest-tracking', true, $idLang),
            '{order_header_line_html}' => $this->l('Booking confirmed – payment at property'),
            '{extra_mail_content_html}' => '',
            '{extra_mail_content_txt}' => '',
        ), $extraVars);

        $extra = $this->getExtraMailContent($this->getOrderStateId(), $order);
        if ($extra) {
            $templateVars = array_merge($templateVars, $extra);
        }

        $subjects = array(
            'en' => 'Booking confirmed – payment at property',
            'cs' => 'Rezervace potvrzena – platba na místě',
            'es' => 'Reserva confirmada – pago en el alojamiento',
        );
        $iso = Language::getIsoById($idLang);
        $subject = isset($subjects[$iso]) ? $subjects[$iso] : $subjects['en'];

        // Use module mails/ so template updates apply without relying on stale copies in /mails/
        Mail::Send(
            $idLang,
            self::MAIL_TEMPLATE,
            $subject,
            $templateVars,
            $customer->email,
            $customer->firstname.' '.$customer->lastname,
            null,
            null,
            null,
            null,
            _PS_MODULE_DIR_.$this->name.'/mails/',
            false,
            (int) $order->id_shop
        );
    }

    /**
     * Internal property notification after a successful Pay at Property booking.
     * Failures are swallowed — booking/order must remain successful for the guest.
     *
     * @param Order $order
     * @param Customer $customer
     */
    public function sendAdminBookingNotification(Order $order, Customer $customer)
    {
        try {
            $this->ensureNotificationEmailConfig();

            $to = trim((string) Configuration::get(self::CONFIG_NOTIFICATION_EMAIL));
            if ($to === '' || !Validate::isEmail($to)) {
                return;
            }

            if (!Validate::isLoadedObject($order) || !(int) $order->id) {
                return;
            }

            // One-shot guard (confirmation refresh never reaches here; this covers retries)
            if ($this->hasAdminNotificationBeenSent((int) $order->id)) {
                return;
            }

            $bookingRows = $this->getHotelBookingRows($order);
            $bookingSummary = $this->buildBookingSummary($bookingRows, $order);
            $guestPhone = $this->getGuestPhone($order, $customer);
            $currency = new Currency((int) $order->id_currency);
            $currencyCode = Validate::isLoadedObject($currency) ? $currency->iso_code : '';

            $idLang = (int) $order->id_lang;
            $iso = Tools::strtolower((string) Language::getIsoById($idLang));
            $mailDir = _PS_MODULE_DIR_.$this->name.'/mails/';
            if (!in_array($iso, array('en', 'cs', 'es'), true)
                || !file_exists($mailDir.$iso.'/'.self::MAIL_TEMPLATE_ADMIN.'.html')
            ) {
                $idLangEn = (int) Language::getIdByIso('en');
                if ($idLangEn) {
                    $idLang = $idLangEn;
                    $iso = 'en';
                }
            }

            $subjects = array(
                'en' => 'New booking – AndeStay Hostel',
                'cs' => 'Nová rezervace – AndeStay Hostel',
                'es' => 'Nueva reserva – AndeStay Hostel',
            );
            $subject = isset($subjects[$iso]) ? $subjects[$iso] : $subjects['en'];

            $templateVars = array(
                '{booking_reference}' => $order->reference,
                '{order_id}' => (int) $order->id,
                '{firstname}' => $customer->firstname,
                '{lastname}' => $customer->lastname,
                '{guest_email}' => $customer->email,
                '{guest_phone}' => $guestPhone !== '' ? $guestPhone : '—',
                '{check_in}' => $bookingSummary['check_in'],
                '{check_out}' => $bookingSummary['check_out'],
                '{room_type}' => $bookingSummary['room_type'],
                '{adults}' => (string) $bookingSummary['adults'],
                '{children}' => (string) $bookingSummary['children'],
                '{total_price}' => Tools::displayPrice(
                    (float) $order->total_paid,
                    $currency,
                    false
                ),
                '{currency}' => $currencyCode,
                '{payment_method}' => 'Pay at property',
                '{order_status}' => 'Awaiting payment at property',
                '{shop_name}' => Configuration::get('PS_SHOP_NAME'),
                '{shop_url}' => Context::getContext()->link->getPageLink('index', true, $idLang),
            );

            $sent = Mail::Send(
                $idLang,
                self::MAIL_TEMPLATE_ADMIN,
                $subject,
                $templateVars,
                $to,
                null,
                null,
                null,
                null,
                null,
                $mailDir,
                false,
                (int) $order->id_shop
            );

            if ($sent) {
                $this->markAdminNotificationSent((int) $order->id);
            }
        } catch (Exception $e) {
            $this->logAdminNotificationFailure($e->getMessage(), $order);
        } catch (Throwable $e) {
            $this->logAdminNotificationFailure($e->getMessage(), $order);
        }
    }

    /**
     * @param Order $order
     *
     * @return array
     */
    protected function getHotelBookingRows(Order $order)
    {
        if (!class_exists('HotelBookingDetail')) {
            return array();
        }

        $objHotelBooking = new HotelBookingDetail();
        $rows = array();

        if (method_exists($objHotelBooking, 'getBookingDataByOrderId')) {
            $rows = $objHotelBooking->getBookingDataByOrderId((int) $order->id);
        }

        if ((!is_array($rows) || !count($rows))
            && method_exists($objHotelBooking, 'getBookingDataByOrderReference')
        ) {
            $rows = $objHotelBooking->getBookingDataByOrderReference($order->reference);
        }

        return is_array($rows) ? $rows : array();
    }

    /**
     * Aggregate stay / occupancy / room type from HotelBookingDetail rows.
     *
     * @param array $rows
     * @param Order $order
     *
     * @return array
     */
    protected function buildBookingSummary(array $rows, Order $order)
    {
        $checkIn = '—';
        $checkOut = '—';
        $roomTypes = array();
        $adults = 0;
        $children = 0;

        if (count($rows)) {
            $fromDates = array();
            $toDates = array();
            foreach ($rows as $row) {
                if (!empty($row['date_from'])) {
                    $fromDates[] = $row['date_from'];
                }
                if (!empty($row['date_to'])) {
                    $toDates[] = $row['date_to'];
                }
                if (!empty($row['room_type_name'])) {
                    $roomTypes[] = $row['room_type_name'];
                } elseif (!empty($row['id_product'])) {
                    $product = new Product((int) $row['id_product'], false, (int) $order->id_lang);
                    if (Validate::isLoadedObject($product) && $product->name) {
                        $roomTypes[] = is_array($product->name)
                            ? $product->name[(int) $order->id_lang]
                            : $product->name;
                    }
                }
                $adults += isset($row['adults']) ? (int) $row['adults'] : 0;
                $children += isset($row['children']) ? (int) $row['children'] : 0;
            }

            if (count($fromDates)) {
                sort($fromDates);
                $checkIn = $this->formatBookingDate($fromDates[0]);
            }
            if (count($toDates)) {
                rsort($toDates);
                $checkOut = $this->formatBookingDate($toDates[0]);
            }
        }

        $roomTypes = array_values(array_unique(array_filter($roomTypes)));
        $roomTypeLabel = count($roomTypes) ? implode(', ', $roomTypes) : '—';

        return array(
            'check_in' => $checkIn,
            'check_out' => $checkOut,
            'room_type' => $roomTypeLabel,
            'adults' => $adults,
            'children' => $children,
        );
    }

    /**
     * @param string $date
     *
     * @return string
     */
    protected function formatBookingDate($date)
    {
        $ts = strtotime($date);
        if ($ts === false) {
            return (string) $date;
        }

        return date('Y-m-d', $ts);
    }

    /**
     * Guest phone from delivery/invoice address (Customer has no phone in core).
     *
     * @param Order $order
     * @param Customer $customer
     *
     * @return string
     */
    protected function getGuestPhone(Order $order, Customer $customer)
    {
        $addressIds = array(
            (int) $order->id_address_delivery,
            (int) $order->id_address_invoice,
        );

        foreach ($addressIds as $idAddress) {
            if (!$idAddress) {
                continue;
            }
            $address = new Address($idAddress);
            if (!Validate::isLoadedObject($address)) {
                continue;
            }
            if (!empty($address->phone_mobile)) {
                return trim((string) $address->phone_mobile);
            }
            if (!empty($address->phone)) {
                return trim((string) $address->phone);
            }
        }

        // Optional Customer phone field in some QloApps customizations
        if (!empty($customer->phone)) {
            return trim((string) $customer->phone);
        }

        return '';
    }

    /**
     * @param int $idOrder
     *
     * @return bool
     */
    protected function hasAdminNotificationBeenSent($idOrder)
    {
        if (!class_exists('Message')) {
            return false;
        }

        $messages = Message::getMessagesByOrderId((int) $idOrder, true);
        if (!is_array($messages)) {
            return false;
        }

        foreach ($messages as $message) {
            if (!empty($message['message'])
                && strpos($message['message'], self::ADMIN_NOTIFIED_MARKER) !== false
            ) {
                return true;
            }
        }

        return false;
    }

    /**
     * Persist a private order message so a second notification cannot be sent.
     *
     * @param int $idOrder
     */
    protected function markAdminNotificationSent($idOrder)
    {
        if (!class_exists('Message')) {
            return;
        }

        try {
            $message = new Message();
            $message->id_order = (int) $idOrder;
            $message->message = self::ADMIN_NOTIFIED_MARKER;
            $message->private = 1;
            $message->add();
        } catch (Exception $e) {
            // ignore — booking must not fail
        } catch (Throwable $e) {
            // ignore
        }
    }

    /**
     * @param string $error
     * @param Order|null $order
     */
    protected function logAdminNotificationFailure($error, $order = null)
    {
        if (!class_exists('PrestaShopLogger')) {
            return;
        }

        $suffix = ($order && Validate::isLoadedObject($order))
            ? ' (order '.(int) $order->id.')'
            : '';
        PrestaShopLogger::addLog(
            'payatproperty admin notification failed'.$suffix.': '.$error,
            3,
            null,
            'Order',
            $order && Validate::isLoadedObject($order) ? (int) $order->id : null,
            true
        );
    }
}
