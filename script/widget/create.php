<style>
	.widget { padding-bottom: 1em; border-bottom: 1px solid #eee; }
	.widget iframe { border: 1px solid #333; width: 240px; height: 230px; }
	.widget-marker iframe { height: 225px; }
</style>

<div class="container">
	<div class="jumbotron">
		<h2>Widget 小工具(測試中</h2>
		<p>
			如果想把特定測站嵌入網頁，您可以從下方預覽小工具與取得HTML碼
		</p>
	</div>

	<div class="row widget widget-text">
		<div class="col-sm-4 text-center">
			<iframe src="<?=getWidgetUrl('text')?>" frameborder="0"></iframe>
		</div>
		<div class="col-sm-8">
			<h3>簡約列表</h3>
			
			<span class="label label-primary">Size</span>
			<pre>width: 240px, height: 230px</pre>

			<span class="label label-success">Code</span>
			<pre><?=htmlspecialchars("<iframe src='".getWidgetUrl('text')."'></iframe>");?></pre>
		</div>
	</div>
	
	<div class="row widget widget-marker">
		<div class="col-sm-4 text-center">
			<iframe src="<?=getWidgetUrl('marker')?>" frameborder="0"></iframe>
		</div>
		<div class="col-sm-8">
			<h3>醒目圖示</h3>

			<span class="label label-primary">Size</span>
			<pre>width: 240px, height: 225px</pre>

			<span class="label label-success">Code</span>
			<pre><?=htmlspecialchars("<iframe src='".getWidgetUrl('marker')."'></iframe>");?></pre>
		</div>
	</div>
</div>