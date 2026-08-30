<?php
/**
 * Persistence for AndeStay solo occupancy rules.
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
     * @return array id_product => rule row
     */
    public function getSoloRulesIndexedByProduct()
    {
        $rows = Db::getInstance()->executeS(
            'SELECT * FROM `'._DB_PREFIX_.'andestay_occupancy_rule`
             WHERE `adults` = 1 AND `children` = 0'
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
     * Active solo rule for a room type, or false.
     *
     * @param int $idProduct
     *
     * @return array|false
     */
    public function getActiveSoloRule($idProduct)
    {
        return Db::getInstance()->getRow(
            'SELECT * FROM `'._DB_PREFIX_.'andestay_occupancy_rule`
             WHERE `id_product` = '.(int) $idProduct.'
               AND `adults` = 1
               AND `children` = 0
               AND `active` = 1'
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
        $existing = Db::getInstance()->getRow(
            'SELECT `id_rule` FROM `'._DB_PREFIX_.'andestay_occupancy_rule`
             WHERE `id_product` = '.(int) $idProduct.'
               AND `adults` = 1
               AND `children` = 0'
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
                'adults' => 1,
                'children' => 0,
                'price_te' => (float) $priceTe,
                'active' => (int) $active,
                'date_add' => pSQL($now),
                'date_upd' => pSQL($now),
            )
        );
    }
}
