<?php
/**
 * Creates the order/booking via PaymentModule::validateOrder() — same mechanism as cheque/bankwire.
 */

class PayAtPropertyValidationModuleFrontController extends ModuleFrontController
{
    public function postProcess()
    {
        $cart = $this->context->cart;

        if ((int) $cart->id_customer === 0 || !$this->module->active) {
            Tools::redirect('index.php?controller=order&step=1');
        }

        $authorized = false;
        $paymentModules = Module::getPaymentModules();
        if (!is_array($paymentModules)) {
            $paymentModules = array();
        }
        foreach ($paymentModules as $module) {
            if (isset($module['name']) && $module['name'] == 'payatproperty') {
                $authorized = true;
                break;
            }
        }
        if (!$authorized) {
            die($this->module->l('This payment method is not available.', 'validation'));
        }

        if (!$this->module->isCartBookable($cart)) {
            Tools::redirect('index.php?controller=order');
        }

        // Prevent duplicate order on refresh / double submit
        if ($cart->OrderExists()) {
            $idOrder = Order::getOrderByCartId((int) $cart->id);
            $customer = new Customer((int) $cart->id_customer);
            Tools::redirect(
                'index.php?controller=order-confirmation&id_cart='.(int) $cart->id
                .'&id_module='.(int) $this->module->id
                .'&id_order='.(int) $idOrder
                .'&key='.$customer->secure_key
            );
        }

        if (class_exists('ServiceProductCartDetail')) {
            ServiceProductCartDetail::validateServiceProductsInCart();
        }

        if (Module::isInstalled('hotelreservationsystem') && Module::isEnabled('hotelreservationsystem')) {
            require_once _PS_MODULE_DIR_.'hotelreservationsystem/define.php';
            if (class_exists('HotelOrderRestrictDate')
                && HotelOrderRestrictDate::validateOrderRestrictDateOnPayment($this)
            ) {
                Tools::redirect('index.php?controller=order-opc');
            }
        }

        $customer = new Customer((int) $cart->id_customer);
        if (!Validate::isLoadedObject($customer)) {
            Tools::redirect('index.php?controller=order&step=1');
        }

        $currency = $this->context->currency;
        if (!empty($cart->is_advance_payment)) {
            $total = $cart->getOrderTotal(true, Cart::ADVANCE_PAYMENT);
        } else {
            $total = $cart->getOrderTotal(true, Cart::BOTH);
        }

        $idOrderState = (int) $this->module->getOrderStateId();
        if (!$idOrderState) {
            // Fallback: never block booking if state missing
            $idOrderState = (int) Configuration::get('PS_OS_AWAITING_PAYMENT');
        }

        $mailVars = array();

        $this->module->validateOrder(
            (int) $cart->id,
            $idOrderState,
            $total,
            $this->module->displayName,
            null,
            $mailVars,
            (int) $currency->id,
            false,
            $customer->secure_key
        );

        // Core auto-mails only PS_OS_AWAITING_* — send our confirmation explicitly.
        // Admin notification runs only on this first successful create path
        // (OrderExists() above skips the whole block on confirmation refresh).
        if ($this->module->currentOrder) {
            $order = new Order((int) $this->module->currentOrder);
            if (Validate::isLoadedObject($order)) {
                $this->module->sendPayAtPropertyMail($order, $customer, $mailVars);
                $this->module->sendAdminBookingNotification($order, $customer);
            }
        }

        Tools::redirect(
            'index.php?controller=order-confirmation&id_cart='.(int) $cart->id
            .'&id_module='.(int) $this->module->id
            .'&id_order='.(int) $this->module->currentOrder
            .'&key='.$customer->secure_key
        );
    }
}
