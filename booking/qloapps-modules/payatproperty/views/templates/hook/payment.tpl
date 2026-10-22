{*
* Pay at Property — checkout payment option
*}
<div class="row">
	<div class="col-xs-12">
		<p class="payment_module">
			<a class="payatproperty" style="background: url({$this_path_ssl|escape:'html':'UTF-8'}logo.png) 15px 12px no-repeat #fbfbfb;" href="{$link->getModuleLink('payatproperty', 'payment', [], true)|escape:'html':'UTF-8'}" title="{l s='Pay at property' mod='payatproperty'}">
				{l s='Pay at property' mod='payatproperty'} <span>{l s='(pay when you arrive)' mod='payatproperty'}</span>
			</a>
		</p>
	</div>
</div>
