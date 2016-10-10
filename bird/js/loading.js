//三个参数: 1.所有要加载的图片对象
			//2. 加载进度函数
			//3. 加载完成函数
			function loading (imgsObj, handleObj) {
				//遍历对象, 得到对象中属性的个数, 即有多少张图片
				var count = 0;
				var currentIndex = 0;
				for(prop in imgsObj) {
				    count++;
				}
				//图片全部加载完成之后传出的对象
				var imgObj = {};
				for(prop in imgsObj) {
					var img = new Image();
					img.src = imgsObj[prop];
					img.onload = (function (prop) {
						return function () {
							currentIndex++;
							var scale = currentIndex/count*100;
							if(handleObj.progress){
								handleObj.progress(scale);
							}
							
							imgObj[prop] = this;
							if (handleObj.complete) {
								if (currentIndex == count) {
								handleObj.complete(imgObj);
								}
							}
							
						}	
					})(prop)
					    
				}

			}