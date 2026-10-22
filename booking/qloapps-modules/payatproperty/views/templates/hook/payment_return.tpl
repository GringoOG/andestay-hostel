{*
* Pay at Property — order confirmation return block
*}
{if $status == 'ok'}
	<p class="alert alert-success">
		{if isset($cart_room_bookings) && $cart_room_bookings|@count > 1}
			{l s='Your bookings have been created successfully!' mod='payatproperty'}
		{else}
			{l s='Your booking has been created successfully!' mod='payatproperty'}
		{/if}
	</p>
	<br />
	<p>
		{l s='Amount to pay at the property:' mod='payatproperty'}
		<span class="price"><strong>{$total_to_pay|escape:'html':'UTF-8'}</strong></span>
	</p>
	<p>
		{l s='Pay in cash when you arrive at the property.' mod='payatproperty'}
	</p>
	{if isset($reference) && $reference}
		<p>{l s='Do not forget your order reference %s.' sprintf=$reference|escape:'html':'UTF-8' mod='payatproperty'}</p>
	{elseif isset($id_order) && $id_order}
		<p>{l s='Do not forget your order reference %s.' sprintf=$id_order|intval mod='payatproperty'}</p>
	{/if}
	<br />
{else}
	<p class="alert alert-warning">
		{l s='We noticed a problem with your order. If you think this is an error, feel free to contact our' mod='payatproperty'}
		<a href="{$link->getPageLink('contact', true)|escape:'html':'UTF-8'}">{l s='customer service department.' mod='payatproperty'}</a>.
	</p>
{/if}
