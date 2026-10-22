{* AndeStay: readable extra demands / services — stacked lines only. *}
{if isset($list) && $list}
{assign var=room_demand_exists value=0}
{assign var=room_additinal_services_exists value=0}

{foreach from=$list key=data_k item=data_v}
	{foreach from=$data_v['date_diff'] key=rm_k item=rm_v}
		{if isset($rm_v['extra_demands']) && $rm_v['extra_demands']}
			{assign var=room_demand_exists value=1}
		{/if}
		{if isset($rm_v['additional_services']) && $rm_v['additional_services']}
			{assign var=room_additinal_services_exists value=1}
		{/if}
	{/foreach}
{/foreach}

{if $room_demand_exists}
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;max-width:600px;border-collapse:collapse;margin:0 0 16px 0;">
	<tr>
		<td style="padding:12px 16px;background-color:#222222;font-family:Arial, Helvetica, sans-serif;font-size:16px;line-height:1.4;color:#ffffff;font-weight:bold;text-align:left;">
			{l s='Room Extra Demands Detail'}
		</td>
	</tr>
	{foreach from=$list key=data_k item=data_v}
		{foreach from=$data_v['date_diff'] key=rm_k item=rm_v}
			{if isset($rm_v['extra_demands']) && $rm_v['extra_demands']}
				{assign var=roomCount value=1}
				{foreach $rm_v['extra_demands'] as $roomDemand}
					{foreach from=$roomDemand['extra_demands'] item=demand}
					<tr>
						<td style="padding:12px 16px;border:1px solid #dddddd;border-top:none;background-color:#ffffff;font-family:Arial, Helvetica, sans-serif;font-size:15px;line-height:1.5;color:#222222;text-align:left;">
							<p style="margin:0 0 4px 0;font-size:13px;color:#666666;">{l s='Room Type'}</p>
							<p style="margin:0 0 10px 0;"><strong>{$data_v['name']}</strong></p>
							<p style="margin:0 0 4px 0;font-size:13px;color:#666666;">{l s='Dates'}</p>
							<p style="margin:0 0 10px 0;">{$rm_v['data_form']|date_format:"%d-%m-%Y"} {l s='to'} {$rm_v['data_to']|date_format:"%d-%m-%Y"} · {l s='Room'} {$roomCount}</p>
							<p style="margin:0 0 4px 0;font-size:13px;color:#666666;">{l s='Name'}</p>
							<p style="margin:0 0 10px 0;">{$demand['name']}</p>
							<p style="margin:0 0 4px 0;font-size:13px;color:#666666;">{l s='Total'}</p>
							<p style="margin:0;"><strong>{convertPrice price=$demand['total_price_tax_excl']}</strong></p>
						</td>
					</tr>
					{/foreach}
					{assign var=roomCount value=$roomCount+1}
				{/foreach}
			{/if}
		{/foreach}
	{/foreach}
</table>
{else}
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;max-width:600px;border-collapse:collapse;margin:0 0 16px 0;">
	<tr>
		<td style="padding:12px 16px;border:1px solid #dddddd;background-color:#f8f8f8;font-family:Arial, Helvetica, sans-serif;font-size:14px;line-height:1.5;color:#666666;text-align:left;">
			{l s='No room extra demands added.'}
		</td>
	</tr>
</table>
{/if}

{if $room_additinal_services_exists}
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;max-width:600px;border-collapse:collapse;margin:0 0 16px 0;">
	<tr>
		<td style="padding:12px 16px;background-color:#222222;font-family:Arial, Helvetica, sans-serif;font-size:16px;line-height:1.4;color:#ffffff;font-weight:bold;text-align:left;">
			{l s='Rooms Services Detail'}
		</td>
	</tr>
	{foreach from=$list key=data_k item=data_v}
		{foreach from=$data_v['date_diff'] key=rm_k item=rm_v}
			{if isset($rm_v['additional_services']) && $rm_v['additional_services']}
				{assign var=roomCount value=1}
				{foreach $rm_v['additional_services'] as $roomService}
					{foreach from=$roomService['additional_services'] item=service}
					<tr>
						<td style="padding:12px 16px;border:1px solid #dddddd;border-top:none;background-color:#ffffff;font-family:Arial, Helvetica, sans-serif;font-size:15px;line-height:1.5;color:#222222;text-align:left;">
							<p style="margin:0 0 4px 0;font-size:13px;color:#666666;">{l s='Room Type'}</p>
							<p style="margin:0 0 10px 0;"><strong>{$data_v['name']}</strong></p>
							<p style="margin:0 0 4px 0;font-size:13px;color:#666666;">{l s='Dates'}</p>
							<p style="margin:0 0 10px 0;">{$rm_v['data_form']|date_format:"%d-%m-%Y"} {l s='to'} {$rm_v['data_to']|date_format:"%d-%m-%Y"} · {l s='Room'} {$roomCount}</p>
							<p style="margin:0 0 4px 0;font-size:13px;color:#666666;">{l s='Name'}</p>
							<p style="margin:0 0 10px 0;">{$service['name']}{if $service['allow_multiple_quantity']} · {l s='Qty'} {$service['quantity']}{/if}</p>
							<p style="margin:0 0 4px 0;font-size:13px;color:#666666;">{l s='Total'}</p>
							<p style="margin:0;"><strong>{convertPrice price=$service['total_price_tax_excl']}</strong></p>
						</td>
					</tr>
					{/foreach}
					{assign var=roomCount value=$roomCount+1}
				{/foreach}
			{/if}
		{/foreach}
	{/foreach}
</table>
{else}
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;max-width:600px;border-collapse:collapse;margin:0 0 16px 0;">
	<tr>
		<td style="padding:12px 16px;border:1px solid #dddddd;background-color:#f8f8f8;font-family:Arial, Helvetica, sans-serif;font-size:14px;line-height:1.5;color:#666666;text-align:left;">
			{l s='No additional services requested.'}
		</td>
	</tr>
</table>
{/if}
{/if}
