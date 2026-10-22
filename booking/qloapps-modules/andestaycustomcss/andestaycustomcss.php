<?php

if (!defined('_PS_VERSION_')) {
    exit;
}

class AndeStayCustomCss extends Module
{
    public function __construct()
    {
        $this->name = 'andestaycustomcss';
        $this->tab = 'front_office_features';
        $this->version = '1.0.0';
        $this->author = 'AndeStay';
        $this->need_instance = 0;
        $this->bootstrap = true;

        parent::__construct();

        $this->displayName = $this->l('AndeStay Custom CSS');
        $this->description = $this->l('Improves the readability of the homepage hero text.');
        $this->ps_versions_compliancy = array('min' => '1.6', 'max' => _PS_VERSION_);
    }

    public function install()
    {
        return parent::install() && $this->registerHook('displayHeader');
    }

    public function hookDisplayHeader($params)
    {
        if (isset($this->context->controller->php_self)
            && $this->context->controller->php_self === 'index'
        ) {
            $this->context->controller->addCSS(
                $this->_path . 'views/css/front.css',
                'all'
            );
        }
    }
}
