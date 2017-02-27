<?php 
require("html/common.php"); 
$msg = getMsg();
?>
<!DOCTYPE html>
<html lang="">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

		<meta property="og:title" content="g0v零時空汙觀測網">
		<meta property="og:description" content="g0v Realtime Air Pollution Map">
		<meta property="og:type" content="website">
		<meta property="og:url" content="https://airmap.g0v.asper.tw/">
		<meta property="og:image" content="https://i.imgur.com/Tv1rgZO.jpg">

		<title data-lang="pageTitle">g0v零時空汙觀測網</title>
		<link rel='shortcut icon' type='image/x-icon' href='https://i.imgur.com/Gro4juQ.png' />
		<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/css/bootstrap.min.css">
		<link rel="stylesheet" href="<?=asset('css', 'map.css')?>">
	</head>
	<body>
		<?php if( !is_null($msg) ):?>
		<style>#container{ height: calc(100% - 2em); top: 2em; }</style>
		<div id="msg"><?=$msg;?></div>
		<?php endif;?>

		<div id="container">
			<div id="loading" class="loading">
				<div class="spinner">
					<div class="rect1"></div>
					<div class="rect2"></div>
					<div class="rect3"></div>
					<div class="rect4"></div>
					<div class="rect5"></div>
				</div>
				<div class="msg"></div>
			</div>

			<div id="siteLogo">
				<a href="http://beta.hackfoldr.org/g0vairmap/g0v--riRTvbB0E5x">
					<img src="https://i.imgur.com/IWqy7yh.png" class="img-responsive" alt="Image">
				</a>			
			</div>
			<div id="recruit">
				<a href='/recruit' class="popover right">
					<div class="arrow"></div>
					<div class="popover-content" data-lang="recruit">自造站點募集中</div>
				</a>
			</div>
		
			<div id="map-container"></div>
		
			<div id="navigator">
				<button type="button" class="navbar-toggle navigator-toggle" v-on:click="toggleContainer">
					<span v-show="open" class="glyphicon glyphicon-triangle-left"></span>
					<span v-show="!open" class="glyphicon glyphicon-triangle-right"></span>
				</button>

				<div class="header">
					<div class="logo-side">
						<div class="lang-switch">
							<input type="checkbox" class="bs-switch" id="languageSwitch" checked="checked" data-size="mini" data-off-text="中文" data-on-text="En" data-on-Color="default" data-off-Color="default">
						</div>
					</div>

					<div class="map-search">
						<div class="input-group">
							<span class="input-group-addon">
								<span class="glyphicon glyphicon-search"></span>
							</span>
							<input type="text" id="typeahead" class="form-control typeahead" placeholder="Search Map" 
								autocomplete="off">
						</div>
					</div>
				</div>

				<ul class="list-group">
					<li class="list-group-item" data-name="siteList" >
						<h4 class="list-group-item-heading">
							<span data-lang="siteList">站點清單</span>
							<a href='/list' class="pull-right btn btn-primary btn-xs" target="_blank">
								&nbsp;<span class="glyphicon glyphicon-list-alt"></span>&nbsp;
							</a>
						</h4>
					</li>

					<li class="list-group-item" data-name="siteLayer" >
						<h4 class="list-group-item-heading" v-on:click="changeActiveItem">
							<span data-lang="siteFilter">測量站點</span>
							<input type="checkbox" class="bs-switch layerToggle siteLayer">
						</h4>
						<div class="list-group-item-text" v-show="showItemText('siteLayer')" transition="slide">
							<div class="blockquote">
								<span class="title" data-lang="group">群組</span>
								<div class="site-category-allswitch">
									<button type="button" class="btn btn-xs btn-success" v-on:click="site_selectAllCategory" data-lang="selectAll">Select All</button>
									<button type="button" class="btn btn-xs btn-defalut" v-on:click="site_deselectAllCategory" data-lang="selectNone">Deselect All</button>
								</div>
							</div>
							<div class="blockquote-content category">
								<button type="button" class="btn btn-sm btn-site" 
									data-category="{{cate.name}}"
									v-for="cate in site.category"
									v-bind:class="{'btn-default': !cate.active, 'btn-success': cate.active}" 
									v-on:click="site_changeCategory">
									<div class="count">{{ cate.cnt }}</div>
									<div class="name">{{ cate.name }}</div>
								</button>
							</div>

							<div class="blockquote">
								<span class="title" data-lang="measureType">量測類別</span>
							</div>
							<div class="blockquote-content">
								<button type="button" class="btn btn-sm btn-site" 
									v-for="measure in site.measure"
									v-bind:class="{'btn-default': !measure.active, 'btn-primary': measure.active}" 
									v-on:click="site_changeMeasure"
								>{{ measure.name }}</button>
							</div>
						</div>
					</li>

					<li class="list-group-item" data-name="mapTool" >
						<h4 class="list-group-item-heading" v-on:click="changeActiveItem">
							<span data-lang="mapTool">地圖工具</span>
						</h4>
						<div class="list-group-item-text" v-show="showItemText('mapTool')" transition="slide">
							<div class="blockquote">
								<span class="title" data-lang="districtChange">區域切換</span>
							</div>
							<div class="blockquote-content">
								<button type="button" class="btn btn-default" data-area="taipei" v-on:click="areaQuickNavi">台北市</button>
								<button type="button" class="btn btn-default" data-area="taichung" v-on:click="areaQuickNavi">台中市</button>
								<button type="button" class="btn btn-default" data-area="chiayi" v-on:click="areaQuickNavi">嘉義市</button>
								<button type="button" class="btn btn-default" data-area="kaohsiung" v-on:click="areaQuickNavi">高雄市</button>
							</div>

							<div class="blockquote">
								<span class="title" data-lang="voronoiDiagram">勢力地圖</span>
							</div>
							<div class="blockquote-content">
								<div class="blockquote">
									<span class="title" data-lang="display">顯示</span>
									<input type="checkbox" class="bs-switch siteVoronoi">
								</div>
								
								<div class="blockquote">
									<span class="title">
										<span data-lang="opacity">透明度</span> <code>{{ site.voronoiLayerOpacity }}</code>
									</span>
									<input type="text" data-provide="slider" data-slider-min="1" data-slider-max="10" data-slider-step="1" lang="zh-tw" v-model="site.voronoiLayerOpacity">
								</div>
							</div>
						</div>
					</li>

					<li class="list-group-item" data-name="resourceLayer">
						<h4 class="list-group-item-heading" v-on:click="changeActiveItem">
							<span data-lang="resourceLayer">資源圖層</span>
						</h4>
						<div class="list-group-item-text" v-show="showItemText('resourceLayer')" transition="slide">
							<div class="blockquote">
								<span class="title" data-lang="emissionLayer">固定汙染源</span>
							</div>
							<div class="blockquote-content">
								<div class="blockquote">
									<span class="title" data-lang="displayEmissionStaton">顯示站點</span>
									<input type="checkbox" class="bs-switch emissionSites" data-size="small">
								</div>

								<div class="blockquote">
									<span class="title" data-lang="voronoiDiagram">勢力地圖</span>
									<input type="checkbox" class="bs-switch emissionVoronoiLayer" data-size="small">
								</div>
								
								<div class="blockquote">
									<span class="title">
										<span data-lang="opacity">透明度</span> <code>{{ emission_opacity }}</code>
									</span>
									<input type="text" data-provide="slider" data-slider-min="1" data-slider-max="10" data-slider-step="1" lang="zh-tw" data-slider-value="{{ emission_opacity }}" v-model="emission_opacity">
								</div>
							</div>

							<div class="blockquote">
								<span class="title" data-lang="cwbImage">氣象雲圖</span>
							</div>
							<div class="blockquote-content">

								<div class="blockquote">
									<span class="glyphicon glyphicon-alert"></span>
									<span data-lang="imageProjectionNotEqual">雲圖與地圖投影法不相同，位置會有誤差。</span>
								</div>

								<div class="blockquote">
									<span class="title" data-lang="display">顯示</span>
									<input type="checkbox" class="bs-switch satelliteLayer" data-size="small">
								</div>
								
								<div class="blockquote">
									<span class="title">
										<span data-lang="opacity">透明度</span> <code>{{ satellite_opacity }}</code>
									</span>
									<input type="text" data-provide="slider" data-slider-min="1" data-slider-max="9" data-slider-step="1" lang="zh-tw" data-slider-value="{{ satellite_opacity }}" v-model="satellite_opacity">
								</div>
							</div>
						</div>
					</li>

					<li class="list-group-item" data-name="siteChart">
						<h4 class="list-group-item-heading" v-on:click="changeActiveItem">
							<span data-lang="siteChart">測站圖表</span>
						</h4>
						<div class="list-group-item-text" v-show="showItemText('siteChart')" transition="slide">
							<div class="loading"  
								 v-bind:style="{display: site.chartLoading ? 'block' : 'none'}">
								<div class="spinner">
									<div class="rect1"></div>
									<div class="rect2"></div>
									<div class="rect3"></div>
									<div class="rect4"></div>
									<div class="rect5"></div>
								</div>
							</div>

							<div v-show="!site.instance">
								<h5 data-lang="selectSiteFirst" style='text-align: center;'></h5>
							</div>

							<div v-show="site.instance">
								<h5>{{site.chartTitle}}</h5>
								
								<div v-show="!site.chartLoadingError">
									<div id="site-history-chart" height="300"></div>
								</div>

								<div class="site-history-error" v-show="site.chartLoadingError">{{site.chartLoadingError}}</div>

								<div class="blockquote">
									<span class="btn btn-xs" data-lang="lastHourChart" title="過去一小時歷史數值" v-on:click="changeChartInterval('Hourly')" v-bind:class="{'btn-primary': site_chartIntervalActive('Hourly'), 'btn-default': !site_chartIntervalActive('Hourly') }">
										<span class="visible-xs-inline visible-sm-inline">H</span>
										<span class="visible-md-inline visible-lg-inline">Hourly</span>
									</span>

									<span class="btn btn-xs" data-lang="lastDayChart" title="過去一天歷史數值" v-on:click="changeChartInterval('Daily')" v-bind:class="{'btn-primary': site_chartIntervalActive('Daily'), 'btn-default': !site_chartIntervalActive('Daily') }">
										<span class="visible-xs-inline visible-sm-inline">D</span>
										<span class="visible-md-inline visible-lg-inline">Daily</span>
									</span>

									<span class="btn btn-xs" data-lang="lastWeekChart" title="過去一週歷史數值" v-on:click="changeChartInterval('Weekly')" v-bind:class="{'btn-primary': site_chartIntervalActive('Weekly'), 'btn-default': !site_chartIntervalActive('Weekly') }">
										<span class="visible-xs-inline visible-sm-inline">W</span>
										<span class="visible-md-inline visible-lg-inline">Weekly</span>
									</span>

									<span class="btn btn-xs" data-lang="lastMonthChart" title="過去一個月歷史數值" v-on:click="changeChartInterval('Monthly')" v-bind:class="{'btn-primary': site_chartIntervalActive('Monthly'), 'btn-default': !site_chartIntervalActive('Monthly') }">
										<span class="visible-xs-inline visible-sm-inline">M</span>
										<span class="visible-md-inline visible-lg-inline">Monthly</span>
									</span>
								</div>
							</div>
						</div>
					</li>

					<li class="list-group-item" data-name="externalLink">
						<h4 class="list-group-item-heading" v-on:click="changeActiveItem">
							<span data-lang="externalLink">資源連結</span>
						</h4>
						<div class="list-group-item-text" v-show="showItemText('externalLink')" transition="slide">
							<fieldset>
								<legend><a href='http://nrl.iis.sinica.edu.tw/LASS/AirBox/' target='_blank'>Airbox 上線狀態</a></legend>
								<ul>
									<li><a href='http://nrl.iis.sinica.edu.tw/LASS/AirBox/detail.php?city=lass' target='_blank'>LASS上線狀態</a></li>
									<li><a href='http://nrl.iis.sinica.edu.tw/LASS/AirBox/detail.php?city=taipei' target='_blank'>台北國小上線狀態</a></li>
									<li><a href='http://nrl.iis.sinica.edu.tw/LASS/AirBox/detail.php?city=newtaipei' target='_blank'>新北國小上線狀態</a></li>
									<li><a href='http://nrl.iis.sinica.edu.tw/LASS/AirBox/detail.php?city=taichung' target='_blank'>台中國小上線狀態</a></li>
								</ul>
							</fieldset>

							<fieldset>
								<legend><a href='http://nrl.iis.sinica.edu.tw/LASS/AirBox/' target='_blank'>相關地圖</a></legend>

								<ul>
									<li><a href='http://nrl.iis.sinica.edu.tw/LASS/GIS/IDW/' target='_blank'>Inverse Distance Weighting Diagram</a></li>
								</ul>
							</fieldset>
						</div>
					</li>

					<li id="footer">
						<p class="disclaimer" data-lang="disclaimer">
							本零時空汙觀測網僅彙整公開資料提供視覺化參考，並不對資料數據提供保證，實際測值以各資料來源為準。
						</p>
						<p class="datasource">
							<a href="http://lass-net.org/" target="_blank">
								<img src="https://i.imgur.com/6XITiIN.jpg">
							</a>
							<a href="https://github.com/Lafudoci/ProbeCube" target="_blank">
								<img src="https://i.imgur.com/z11DvN7.png">
							</a>
							<a href="https://airbox.edimaxcloud.com"  arget="_blank" title="Edimax Airbox">
								<img src="https://airbox.edimaxcloud.com/images/logo_airbox.png">
							</a>
							<a href="http://airbox.asuscloud.com/"  arget="_blank" title="Asus Cloud">
								<img src="https://i.imgur.com/bUFhdYA.png">
							</a>
						</p>
						<p class="about">Asper &copy; 2017 &nbsp;&nbsp;<a href="/about">About</a></p>
						<p class="link">
							<a href="https://g0vairmap.blogspot.tw/" target="_blank">g0v空汙網的攻城獅日記</a> |
							<a href="https://www.facebook.com/g0vairmap/" target="_blank">Facebook Page</a>
						</p>
					</li>
				</ul>
			</div>

			<div id="indicatorLevel"></div>

			<div id="info-on-map" data-lang="visibleSiteCount" title="Visible site count"></div>
		</div>
	
		<script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>
		<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCDRRT8it4AZpwbORhHeqoi2qrWDmQqD48&libraries=places"></script>
		<script src="https://www.gstatic.com/charts/loader.js"></script>
		<script>google.charts.load('current', {'packages':['corechart']});</script>

		<script src="<?=asset('js', 'vendor-common.js')?>"></script>
		<script src="<?=asset('js', 'vendor-map.js')?>"></script>
		<script src="<?=asset('js', 'map.js')?>"></script>

		<?=showGACode();?>
	</body>
</html>