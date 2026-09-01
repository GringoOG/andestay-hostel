<?php
/**
 * Persistence for AndeStay occupancy pricing rules.
 *
 * Rules are keyed by (id_product, adults, children). Schema unchanged since 1.0.0.
 */

if (!defined('_PS_VERSION_')) {
    exit;
}

class AndestayOccupancyPricingRepository
{
    /**
     * @return array
     */
    public function getRoomTypesForConfig()
    {
        $idLang = (int) Context::getContext()->language->id;
        $sql = 'SELECT hrt.`id_product`, hrt.`id_hotel`, hrt.`max_adults`, hrt.`max_children`,
                       pl.`name`, p.`price` AS base_price
                FROM `'._DB_PREFIX_.'htl_room_type` hrt
                INNER JOIN `'._DB_PREFIX_.'product` p ON (p.`id_product` = hrt.`id_product`)
                LEFT JOIN `'._DB_PREFIX_.'product_lang` pl
                    ON (pl.`id_product` = hrt.`id_product` AND pl.`id_lang` = '.(int) $idLang.')
                WHERE p.`active` = 1
                ORDER BY hrt.`id_hotel` ASC, pl.`name` ASC';

        $rows = Db::getInstance()->executeS($sql);

        return is_array($rows) ? $rows : array();
    }

    /**
     * @param int $adults
     * @param int $children
     *
     * @return array id_product => rule row
     */
    public function getRulesIndexedByProduct($adults, $children)
    {
        $rows = Db::getInstance()->executeS(
            'SELECT * FROM `'._DB_PREFIX_.'andestay_occupancy_rule`
             WHERE `adults` = '.(int) $adults.' AND `children` = '.(int) $children
        );
        $indexed = array();
        if (is_array($rows)) {
            foreach ($rows as $row) {
                $indexed[(int) $row['id_product']] = $row;
            }
        }

        return $indexed;
    }

    /**
     * @param int $idProduct
     *
     * @return array id_product => rule row (1 adult / 0 children)
     */
    public function getSoloRulesIndexedByProduct()
    {
        return $this->getRulesIndexedByProduct(1, 0);
    }

    /**
     * Active rule for exact occupancy, or false.
     *
     * @param int $idProduct
     * @param int $adults
     * @param int $children
     *
     * @return array|false
     */
    public function getActiveRule($idProduct, $adults, $children)
    {
        return Db::getInstance()->getRow(
            'SELECT * FROM `'._DB_PREFIX_.'andestay_occupancy_rule`
             WHERE `id_product` = '.(int) $idProduct.'
               AND `adults` = '.(int) $adults.'
               AND `children` = '.(int) $children.'
               AND `active` = 1'
        );
    }

    /**
     * @param int $idProduct
     *
     * @return array|false
     */
    public function getActiveSoloRule($idProduct)
    {
        return $this->getActiveRule($idProduct, 1, 0);
    }

    /**
     * @param int $idProduct
     * @param int $idHotel
     * @param int $adults
     * @param int $children
     * @param float $priceTe
     * @param int $active
     * @param string $now
     *
     * @return bool
     */
    public function upsertRule($idProduct, $idHotel, $adults, $children, $priceTe, $active, $now)
    {
        $existing = Db::getInstance()->getRow(
            'SELECT `id_rule` FROM `'._DB_PREFIX_.'andestay_occupancy_rule`
             WHERE `id_product` = '.(int) $idProduct.'
               AND `adults` = '.(int) $adults.'
               AND `children` = '.(int) $children
        );

        if ($existing && !empty($existing['id_rule'])) {
            return Db::getInstance()->update(
                'andestay_occupancy_rule',
                array(
                    'id_hotel' => (int) $idHotel,
                    'price_te' => (float) $priceTe,
                    'active' => (int) $active,
                    'date_upd' => pSQL($now),
                ),
                '`id_rule` = '.(int) $existing['id_rule']
            );
        }

        return Db::getInstance()->insert(
            'andestay_occupancy_rule',
            array(
                'id_product' => (int) $idProduct,
                'id_hotel' => (int) $idHotel,
                'adults' => (int) $adults,
                'children' => (int) $children,
                'price_te' => (float) $priceTe,
                'active' => (int) $active,
                'date_add' => pSQL($now),
                'date_upd' => pSQL($now),
            )
        );
    }

    /**
     * @param int $idProduct
     * @param int $idHotel
     * @param float $priceTe
     * @param int $active
     * @param string $now
     *
     * @return bool
     */
    public function upsertSoloRule($idProduct, $idHotel, $priceTe, $active, $now)
    {
        return $this->upsertRule($idProduct, $idHotel, 1, 0, $priceTe, $active, $now);
    }
}
