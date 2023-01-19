
const BMAP_AK = 'x21SV8yA2b10uiY6A13aqvuDEA3jp804';

$(function () {
	page.init();
})

let page = {
	MAKERS: [],
	init: () => {
		page.mountMap();
		page.setSwiperPhotos();
		page.loadEvent();
	},

	/**
	 * 拉取本地配置
	 * @returns
	 */
	loadConf: () => {
		return new Promise(function (resolve, reject) {
			$.getJSON('conf.json', function (conf) {
				resolve(conf);
			})
		})

	},

	/**
	 * 拉取js文件
	 * @param {*} ak 百度地图申请的ak
	 * @returns
	 */
	loadScript: (ak) => {
		return new Promise(function(resolve, reject) {
			let script = document.createElement('script')
			script.type = 'text/javascript'
			script.src =
				'https://api.map.baidu.com/api?v=3.0&ak=' + ak + '&callback=init'
			script.onerror = reject
			document.head.appendChild(script)

			if (typeof BMap != 'undefined') {
				resolve(BMap)
			} else {
				setTimeout(function() {
					resolve(BMap)
				}, 1000)
			}
		})
	},

	/**
	 * 地图上绘制标注
	 * @param {*} point 位置
	 */
	addMarker: (map, point) => {
		const deviceSize = new BMap.Size(18, 18) //图标大小
		// 创建图标对象
		const myIcon = new BMap.Icon('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAnBJREFUWEftk89LFHEYxp93Zgx1Z0XUHesQkog/dpxDRUQdIuhSQV6CpLBLUETYpVv+AV4Do0PQLcGoU3moSyAE/aAfoLm7GlLUodpZDVNHpXbniV0IXNtxZnYpCZzj9/u8z/OZl+cr2ORPNjkfWwD/9wZW01YrxFWqjcRMuV0qewOOHd9N4E0+WFF5oLYx9bwciEoArhPoz4cSuBs1kr3/DGA109GRpTq1NlBEeiKxxGhYiLI24NjxIQKX14U90Y3kob8OsDzXvdPNuZ9KBomc0WOJkTAQoTbw3TbbNPAqgXOlQgSYoaac1BsmJ4JCeAIsfe20FFXtdkkLoAWKBUFLQOM0IOMQTsDlBKrUcS+oPwBWbbMtCw4BOBYwLKCMY5q4F6tj09NF5V0/vfC5vUnRtExA13AyKtv15sn0hgD5yyXbPApyGILGcAkeamIOIn26kXi0XuHZAWfW3Oe6HBagvRIIAu8URfoiTYmXHsX1tp9PW61Vkr1NyMFyIAR8+pPa2frmt++95n2fIefa6pzctmEAJ0JCjEbUH33SOLOw0ZwvQH540e7qFcidMAAETkWN5D2/mUAAjm3eIHjJz6zonrymN6eu+M0EAliyzVcA9/qZFT8veRYxEr7dCQgQZ5jw31rdSPr6+wqcTNceUl6XBBA8LpwTR0rdU6MVbUhNVlRCJ2NeIHmzaL2CByIYrG1KvsifL8/G95MYINGzVucKz9fFUrcqBegheb9gIhyhikGvv1r81tUtOQyAcrogB45HjOTDigAKz/BL52Gthh9r6qc/BOnCynzHruyKtER3TI356X074GdQ6f0WwNYGfgE+Lc8hp2q3EQAAAABJRU5ErkJggg==', deviceSize, { imageSize: deviceSize })
		// 创建标注对象并添加到地图
		const marker = new BMap.Marker(point, { icon: myIcon })
		map.addOverlay(marker)
		// marker.addEventListener('click', function (e) {

		// })
	},

	/**
	 * 挂载地图
	 */
	mountMap: () => {
		page.loadScript(BMAP_AK).then(BMap => {
			const map = new BMap.Map('Bmap')
			const point = new BMap.Point(120.52, 30.45)
			map.centerAndZoom(point, 5)

			map.addControl(
				new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL})
			)

			map.enableScrollWheelZoom(true)
			map.enableDoubleClickZoom(true)
			map.setMapStyleV2({
				styleId: '2d5f0db795f885c3e09720650dd6ed38'
			})

			function addPoint(data) {
				let point = new BMap.Point(data[1], data[2])
				page.addMarker(point);
			}

			page.loadConf().then((CONFIG) => {
				const MY_ADDRESS = CONFIG.MY_ADDRESS;
				let myGeo = new BMap.Geocoder()
				for (let i = 0; i < MY_ADDRESS.length; i++) {
					if (typeof MY_ADDRESS[i] == 'object') {
						addPoint(map, MY_ADDRESS[i])
					} else {
						myGeo.getPoint(MY_ADDRESS[i], function(point) {
							if (point) {
								page.addMarker(map, point)
							}
						})
					}
				}
				// console.log(map.getPanes())
			})
		})
	},

	setSwiperPhotos: () => {
		const mySwiper = new Swiper('.my-photo-swiper', {
			slidesPerView: 'auto',
			spaceBetween: 10,
			autoplay: {
				delay: 0,
				disableOnInteraction: false,
			},
			speed: 5000,
			loop: true,
		})

		//鼠标覆盖停止自动切换
		// mySwiper.el.onmouseover = function(){
		// 	mySwiper.autoplay.stop();
		// }

		//鼠标离开开始自动切换
		// mySwiper.el.onmouseout = function(){
		// 	mySwiper.autoplay.start();
		// }


	},

	loadEvent: () => {
		const PhotoModal = document.getElementById('PhotoModal');
		PhotoModal.addEventListener('show.bs.modal', event => {
			const target = event.relatedTarget;
			const imgSrc = $(target).attr('data-bs-src');
			const modalImage = PhotoModal.querySelector('.madal-img')
			$(modalImage).attr('src', imgSrc);
		})
	}
}
