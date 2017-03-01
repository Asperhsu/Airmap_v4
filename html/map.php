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

							<div class="blockquote">
								<span class="title" data-lang="">測站圖示</span>
							</div>
							<div class="blockquote-content site-icon-text">
								<div>
									<svg width="30" height="30" viewBox="-40 -40 100 80" xmlns="http://www.w3.org/2000/svg">
										<circle r="40" stroke="#FFFFFF" stroke-width="3" fill="#333333" />
									</svg>
									<span class="text">一般站點 (無分析資料)</span>
								</div>
								<div>
									<svg width="30" height="30" viewBox="0 0 391.62 371.62" xmlns="http://www.w3.org/2000/svg">
										<path stroke="#FFFFFF" stroke-width="15" fill="#333333" d="M62.513,153.087c-0.009-0.525-0.02-1.049-0.02-1.575c0-50.155,40.659-90.814,90.814-90.814
										c43.222,0,79.388,30.196,88.562,70.643c8.555-4.789,18.409-7.531,28.91-7.531c32.766,0,59.328,26.562,59.328,59.328
										c0,1.339-0.06,2.664-0.148,3.981c24.325,9.03,41.661,32.444,41.661,59.911c0,35.286-28.605,63.892-63.892,63.892H79.865
										C35.757,310.921,0,275.164,0,231.056C0,192.907,26.749,161.011,62.513,153.087z"/>
									</svg>
									<span class="text">偵測到小型污染源</span>
								</div>
								<div>
									<svg width="30" height="30" viewBox="0 0 45.414 39.414" xmlns="http://www.w3.org/2000/svg">
										<path stroke="#FFFFFF" stroke-width="2" fill="#333333" d="M33.609,20.96v12.384c0,1.104-0.896,2-2,2H7.805c-1.104,0-2-0.896-2-2V20.96c0-0.69,0.355-1.332,0.94-1.696l11.901-7.433
										c0.648-0.405,1.472-0.405,2.119,0l11.901,7.433C33.253,19.628,33.609,20.269,33.609,20.96z M38.475,15.432L20.768,4.374
										c-0.648-0.405-1.471-0.405-2.119,0L0.94,15.432c-0.937,0.585-1.221,1.819-0.637,2.756c0.584,0.938,1.816,1.224,2.756,0.638
										L19.707,8.428l16.646,10.396c0.33,0.206,0.695,0.304,1.059,0.304c0.667,0,1.318-0.333,1.697-0.941
										C39.695,17.249,39.41,16.017,38.475,15.432z"/>
									</svg>
									<span class="text">可能放置於室內或設備故障</span>
								</div>
								<div>
									<svg width="30" height="30" viewBox="-10 -10 325.756 345.756" xmlns="http://www.w3.org/2000/svg">
										<g stroke="#FFFFFF" stroke-width="15" fill="#333333" >
											<path d="M303.297,75.612c0-0.057-0.004-0.112-0.005-0.169c-0.123-7.849-6.52-14.174-14.397-14.174c-2.777,0-5.37,0.788-7.571,2.149
											c-1.306-1.326-3.12-2.149-5.129-2.149c-3.697,0-6.74,2.787-7.15,6.375c-1.499-0.353-3.102-0.547-4.773-0.547
											c-2.272,0-4.427,0.352-6.363,0.981c-1.755-2.795-4.856-4.659-8.399-4.659c-5.267,0-9.563,4.106-9.89,9.291
											c-6.28,2.46-10.73,8.569-10.73,15.722c0,9.326,7.559,16.885,16.884,16.885c3.537,0,6.817-1.089,9.529-2.947
											c0.641-0.171,1.262-0.369,1.867-0.59c1.254,0.297,2.559,0.459,3.904,0.459c2.494,0,4.859-0.545,6.99-1.516
											c3.193,3.52,7.803,5.729,12.929,5.729c9.638,0,17.451-7.813,17.451-17.452c0-0.816-0.06-1.618-0.169-2.405
											c3.073-2.641,5.023-6.554,5.023-10.924c0-0.014,0-0.026,0-0.04C303.297,75.625,303.297,75.618,303.297,75.612z"/>
										<path d="M270.253,159.914v-39.816c0-6.19-5.017-11.207-11.206-11.207h-30.158v43.276l36.019,93.711h22.075
											c3.693,0,7.147-1.816,9.237-4.862c2.091-3.045,2.549-6.921,1.225-10.365L270.253,159.914z"/>
										<path d="M213.6,155.003V89.338c0-6.191-5.017-11.207-11.207-11.207h-49.794c-6.19,0-11.207,5.016-11.207,11.207v65.689
											l-6.778,17.637v0.737l42.718,111.119h69.741c3.692,0,7.146-1.816,9.236-4.861c2.09-3.046,2.548-6.923,1.224-10.366L213.6,155.003z"
											/>
										<path d="M119.326,176.237v-65.665c0-6.19-5.017-11.207-11.207-11.207H58.325c-6.19,0-11.207,5.017-11.207,11.207v65.69
											L3.205,290.527c-1.324,3.444-0.866,7.326,1.225,10.365c2.09,3.047,5.543,4.863,9.235,4.863h139.133
											c3.692,0,7.146-1.816,9.237-4.863c2.09-3.045,2.548-6.921,1.224-10.365L119.326,176.237z"/>
										<path d="M40.489,87.268c10.897,0,20.244-5.624,25.031-13.78c5.285,2.862,11.874,4.644,19.13,4.644
											c15.219,0,27.818-7.52,30.446-17.423c4.1,1.995,8.977,3.181,14.232,3.181c5.076,0,9.774-1.126,13.784-2.991
											c4.938,6.28,13.428,10.445,23.111,10.445c11.625,0,21.528-5.997,25.62-14.461c4.966-0.051,9.515-1.808,13.216-4.673
											c2.42,5.39,8.779,9.261,16.334,9.261c9.614,0,17.408-6.25,17.408-13.964c0-1.056-0.17-2.076-0.449-3.065
											c7.794-0.335,13.984-5.056,13.984-10.894c0-5.923-6.37-10.715-14.323-10.919c0.459-1.538,0.788-3.119,0.788-4.792
											c0-9.849-8.561-17.836-19.11-17.836c-8.6,0-15.795,5.345-18.194,12.64c-2.985-1.518-6.31-2.448-9.863-2.448
											c-9.754,0-17.976,6.46-21.11,15.447c-1.403-0.188-2.827-0.362-4.3-0.362c-6.837,0-13.009,2.144-17.836,5.568
											c-4.786-3.803-11.525-6.206-19.06-6.206c-1.215,0-2.368,0.149-3.533,0.264C125.547,13.71,114.36,4.688,100.554,4.688
											c-7.216,0-13.685,2.487-18.293,6.434C76.897,4.398,68.606,0,59.171,0C42.987,0,29.869,12.74,29.869,28.45
											c0,3.051,0.627,5.932,1.543,8.686C20.175,40.588,12.033,50.118,12.033,61.47C12.033,75.717,24.773,87.268,40.489,87.268z
											 M214.049,34.791c0.04,0.01,0.09,0.024,0.14,0.04c-0.05,0.014-0.1,0.044-0.149,0.063C214.039,34.86,214.049,34.825,214.049,34.791z
											"/>
										</g>
									</svg>
									<span class="text">可能接近長時間的固定污染源或設備故障</span>
								</div>
								
								<ul class="about">
									<li>
										分析資料由中央研究院資訊科學研究所提供. 
										<a href="https://sites.google.com/site/pm25opendata/open-data" target="_blank">資料來源</a>
									</li>
									<li>
										Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a>
										from <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>
									</li>
								</ul>
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