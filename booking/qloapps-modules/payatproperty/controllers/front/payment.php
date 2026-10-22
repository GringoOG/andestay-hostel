<?php
/**
 * Confirmation step before creating the booking (same flow as cheque/bankwire).
 */

class PayAtPropertyPaymentModuleFrontController extends ModuleFrontController
{
    public $ssl = true;
    public $display_column_left = false;

    public function initContent()
    {
        parent::initContent();

        $cart = $this->context->cart;
        if (!$this->module->checkCurrency($cart)) {
            Tools::redirect('index.php?controller=order');
        }

        if (!$this->module->isCartBookable($cart)) {
            Tools::redirect('index.php?controller=order');
        }

        if (!empty($cart->is_advance_payment)) {
            $total = $cart->getOrderTotal(true, Cart::ADVANCE_PAYMENT);
        } else {
            $total = $cart->getOrderTotal(true, Cart::BOTH);
        }

        if (class_exists('ServiceProductCartDetail')) {
            ServiceProductCartDetail::validateServiceProductsInCart();
        }

        $restrict_order = false;
        if (Module::isInstalled('hotelreservationsystem') && Module::isEnabled('hotelreservationsystem')) {
            require_once _PS_MODULE_DIR_.'hotelreservationsystem/define.php';
            if (class_exists('HotelOrderRestrictDate')
                && HotelOrderRestrictDate::validateOrderRestrictDateOnPayment($this)
            ) {
                $restrict_order = true;
            }
        }

        if (!empty($this->errors) && is_array($this->errors) && count($this->errors)) {
            $restrict_order = true;
        }

        $currencies = $this->module->getCurrency((int) $cart->id_currency);
        if (!is_array($currencies)) {
            $currencies = array();
        }

        $this->context->smarty->assign(array(
            'nbProducts' => $cart->nbProducts(),
            'cust_currency' => $cart->id_currency,
            'currencies' => $currencies,
            'total' => $total,
            'isoCode' => $this->context->language->iso_code,
            'this_path' => $this->module->getPathUri(),
            'this_path_ssl' => Tools::getShopDomainSsl(true, true).__PS_BASE_URI__.'modules/'.$this->module->name.'/',
            'restrict_order' => $restrict_order,
        ));

        $this->setTemplate('payment_execution.tpl');
    }

    public function setMedia()
    {
        parent::setMedia();
        $this->addJS($this->module->getLocalPath().'views/js/front/payment.js');
    }
}
