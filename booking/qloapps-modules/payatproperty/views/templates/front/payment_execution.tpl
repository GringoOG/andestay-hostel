{*
* Pay at Property — intermediate confirmation page
*}
{capture name=path}{l s='Pay at property' mod='payatproperty'}{/capture}

<h1 class="page-heading">{l s='Order summary' mod='payatproperty'}</h1>

{assign var='current_step' value='payment'}
{include file="$tpl_dir./errors.tpl"}
{include file="$tpl_dir./order-steps.tpl"}

{if isset($nbProducts) && $nbProducts <= 0}
	<p class="alert alert-warning">{l s='Your shopping cart is empty.' mod='payatproperty'}</p>
{else}
	<form action="{$link->getModuleLink('payatproperty', 'validation', [], true)|escape:'html':'UTF-8'}" method="post">
		<div class="box cheque-box">
			<h3 class="page-subheading">{l s='Pay at property' mod='payatproperty'}</h3>
			<p class="cheque-indent">
				<strong class="dark">
					{l s='You have chosen to pay at the property.' mod='payatproperty'}
					{l s='Here is a short summary of your order:' mod='payatproperty'}
				</strong>
			</p>
			<p>
				- {l s='The total amount of your order comes to:' mod='payatproperty'}
				<span id="amount" class="price">{displayPrice price=$total}</span>
				{if isset($use_taxes) && $use_taxes == 1 && isset($display_tax_label) && $display_tax_label}
					{l s='(tax incl.)' mod='payatproperty'}
				{/if}
			</p>
			<p>
				- {l s='Pay in cash when you arrive at the property.' mod='payatproperty'}
				<br />
				- {l s='Please confirm your order by clicking \'I confirm my order\'.' mod='payatproperty'}
			</p>
		</div>
		<p class="cart_navigation clearfix" id="cart_navigation">
			<a href="{$link->getPageLink('order', true, NULL, "step=3")|escape:'html':'UTF-8'}" class="button-exclusive btn btn-default">
				<i class="icon-chevron-left"></i>{l s='Other payment methods' mod='payatproperty'}
			</a>
			{if !$restrict_order}
				<button class="btn pull-right button button-medium confirm_order" type="submit">
					<span>{l s='I confirm my order' mod='payatproperty'}&nbsp;<i class="icon-chevron-right right"></i></span>
				</button>
			{/if}
		</p>
	</form>
{/if}
