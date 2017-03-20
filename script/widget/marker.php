<?php 
/**
 * marker widget
 * minimum view dimension: 230x230
 */
?>

<style>
	body{ overflow-x: hidden; overflow-y: auto; cursor: default; }
	.header{ padding: 8px 8px 0; }
	.header > div { width: 49%; display: inline-block; }
	

	.marker { 
		margin: -10px auto 0; 
		width:180px; height: 180px; 
		border-radius: 50%; border: 2px solid #4F595D; 
		line-height: 180px;
		font-size: 100px;
		text-align: center;
	}

	.footer { padding: 8px 8px 0; margin-top: -15px; }
	.footer > div { width: 49%; display: inline-block; }
	.footer img{ height:25px; }
</style>

<div class="header">
	<div>
		<span class="value"><?=$site['Data']['Temperature']?></span>
		<span class="unit">℃</span>
	</div>
	<div class="text-right">
		<span class="value"><?=$site['Data']['Humidity']?></span>
		<span class="unit">%</span>
	</div>
</div>

<div class="marker pm25color"><?=$site['Data']['Dust2_5']?></div>

<div class="footer">
	<div>
		<a href="/site#<?=$group."$".$id?>">
			<img src="https://i.imgur.com/Gro4juQ.png" alt="g0v icon">
		</a>
	</div>

	<div class="text-right">
		<span class="humanTime"></span>
	</div>
</div>