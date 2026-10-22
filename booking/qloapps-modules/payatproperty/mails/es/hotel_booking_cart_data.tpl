{* AndeStay: fully stacked booking summary — no multi-column tables (Gmail-safe). *}
{if isset($list) && $list}
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;max-width:600px;border-collapse:collapse;margin:0 0 16px 0;">
	<tr>
		<td style="padding:12px 16px;background-color:#222222;font-family:Arial, Helvetica, sans-serif;font-size:16px;line-height:1.4;color:#ffffff;font-weight:bold;text-align:left;">
			{l s='Rooms Booking Detail'}
		</td>
	</tr>
	{foreach from=$list key=data_k item=data_v}
		{foreach from=$data_v['date_diff'] key=rm_k item=rm_v}
			{if !isset($show_full_date)}{assign var="show_full_date" value=0}{/if}
			{assign var="is_full_date" value=($show_full_date && ($rm_v['data_form']|date_format:'%D' == $rm_v['data_to']|date_format:'%D'))}
			<tr>
				<td style="padding:16px;border:1px solid #dddddd;border-top:none;background-color:#ffffff;font-family:Arial, Helvetica, sans-serif;font-size:15px;line-height:1.5;color:#222222;text-align:left;">
					{if isset($data_v['cover_img']) && $data_v['cover_img']}
					<img src="{$data_v['cover_img']}" alt="{$data_v['name']|escape:'html':'UTF-8'}" width="96" border="0" style="width:96px;max-width:96px;height:auto;display:block;margin:0 0 12px 0;border:0;">
					{/if}

					<p style="margin:0 0 4px 0;font-family:Arial, Helvetica, sans-serif;font-size:13px;line-height:1.4;color:#666666;">{l s='Room'}</p>
					<p style="margin:0 0 12px 0;font-family:Arial, Helvetica, sans-serif;font-size:16px;line-height:1.4;color:#222222;"><strong>{$data_v['name']}</strong></p>

					<p style="margin:0 0 4px 0;font-family:Arial, Helvetica, sans-serif;font-size:13px;line-height:1.4;color:#666666;">{l s='Hotel'}</p>
					<p style="margin:0 0 12px 0;font-family:Arial, Helvetica, sans-serif;font-size:15px;line-height:1.4;color:#222222;">{$data_v['hotel_name']}</p>

					<p style="margin:0 0 4px 0;font-family:Arial, Helvetica, sans-serif;font-size:13px;line-height:1.4;color:#666666;">{l s='Guests'}</p>
					<p style="margin:0 0 12px 0;font-family:Arial, Helvetica, sans-serif;font-size:15px;line-height:1.4;color:#222222;">{$rm_v['adults']} {l s='Adults'}, {$rm_v['children']} {l s='Children'}</p>

					<p style="margin:0 0 4px 0;font-family:Arial, Helvetica, sans-serif;font-size:13px;line-height:1.4;color:#666666;">{l s='Unit Price'}</p>
					<p style="margin:0 0 12px 0;font-family:Arial, Helvetica, sans-serif;font-size:15px;line-height:1.4;color:#222222;">{convertPrice price=$rm_v['avg_paid_unit_price_tax_excl']}</p>

					<p style="margin:0 0 4px 0;font-family:Arial, Helvetica, sans-serif;font-size:13px;line-height:1.4;color:#666666;">{l s='Rooms Qty'}</p>
					<p style="margin:0 0 12px 0;font-family:Arial, Helvetica, sans-serif;font-size:15px;line-height:1.4;color:#222222;">{$rm_v['num_rm']}</p>

					<p style="margin:0 0 4px 0;font-family:Arial, Helvetica, sans-serif;font-size:13px;line-height:1.4;color:#666666;">{l s='Check-in Date'}</p>
					<p style="margin:0 0 12px 0;font-family:Arial, Helvetica, sans-serif;font-size:15px;line-height:1.4;color:#222222;">{$rm_v['data_form']|date_format:"%d-%b-%Y"}{if $is_full_date} {$rm_v['data_form']|date_format:"%I:%M %p"}{/if}</p>

					<p style="margin:0 0 4px 0;font-family:Arial, Helvetica, sans-serif;font-size:13px;line-height:1.4;color:#666666;">{l s='Check-out Date'}</p>
					<p style="margin:0 0 12px 0;font-family:Arial, Helvetica, sans-serif;font-size:15px;line-height:1.4;color:#222222;">{$rm_v['data_to']|date_format:"%d-%b-%Y"}{if $is_full_date} {$rm_v['data_to']|date_format:"%I:%M %p"}{/if}</p>

					<p style="margin:0 0 4px 0;font-family:Arial, Helvetica, sans-serif;font-size:13px;line-height:1.4;color:#666666;">{l s='Total'}</p>
					<p style="margin:0;font-family:Arial, Helvetica, sans-serif;font-size:17px;line-height:1.4;color:#222222;"><strong>{convertPrice price=$rm_v['amount_tax_excl']}</strong></p>
				</td>
			</tr>
		{/foreach}
	{/foreach}
</table>
{/if}
