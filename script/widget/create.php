<style>
	.widget { padding-bottom: 1em; border-bottom: 1px solid #eee; }
	.widget .preview { border: 1px solid #333; margin: 0 auto; }
	.widget-marker .preview { width: 230px; }
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
			<div class="preview">
				<?=getIframeHtml('text', '230');?>
			</div>
		</div>
		<div class="col-sm-8">
			<h3>簡約列表</h3>
			
			<span class="label label-primary">建議尺寸</span>
			<pre>高度: 230px</pre>

			<span class="label label-success">Code</span>
			<pre><?=htmlspecialchars(getIframeHtml('text', '230'));?></pre>
		</div>
	</div>
	
	<div class="row widget widget-marker">
		<div class="col-sm-4 text-center">
			<div class="preview">
				<?=getIframeHtml('marker', '220');?>
			</div>
		</div>
		<div class="col-sm-8">
			<h3>醒目圖示</h3>

			<span class="label label-primary">建議尺寸</span>
			<pre>高度比寬度小10px. Ex: width: 230px => height: 220px</pre>

			<span class="label label-success">Code</span>
			<pre><?=htmlspecialchars(getIframeHtml('marker', '220'));?></pre>
		</div>
	</div>
</div>