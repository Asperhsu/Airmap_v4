<?php 
/**
 * marker widget
 * minimum view dimension: 230x230
 */
?>

<style>
	body{ overflow-x: hidden; overflow-y: auto; cursor: default; }
	.header{ padding: 8px 5px 0; }
	.header > div { width: 49%; display: inline-block; margin-right: -4px; }
	

	.marker { 
		margin: -10px auto 0; 
		width:180px; height: 180px; 
		width: 80vw; height: 80vw; 
		border-radius: 50%; border: 2px solid #4F595D; 
		padding-top: 35px;
		padding-top: 15vw;
		text-align: center;
	}
	.marker .name{
		margin: 0;
		font-size: 6vw;
	}
	.marker .value{
		line-height: 1;
		font-size: 90px;
		font-size: 40vw;
	}

	.footer { padding: 8px 5px 0; margin-top: -15px; }
	.footer > div { width: 49%; display: inline-block; margin-right: -4px; }
	.footer img{ height:25px; }
</style>

<div class="header">
	<div title="溫度">
		<span class="value"><?=$site['Data']['Temperature']?></span>
		<span class="unit">℃</span>
	</div>
	<div class="text-right" title="濕度">
		<span class="value"><?=$site['Data']['Humidity']?></span>
		<span class="unit">%</span>
	</div>
</div>

<div class="marker pm25color">
	<p class="name"><?=$site['SiteName']?></p>
	<p class="value"><?=$site['Data']['Dust2_5']?></p>
</div>

<div class="footer">
	<div>
		<a href="/site#<?=$group."$".$id?>" title="site detail page" target="g0vDetail">
			<img src="https://i.imgur.com/Gro4juQ.png" alt="g0v icon">
		</a>
	</div>

	<div class="text-right" title="更新時間">
		<span class="humanTime"></span>
	</div>
</div>