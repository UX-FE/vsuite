/**
 * 渐变颜色 <br>
 */

var Map = function(array, callback, thisObject) {
	if (array.map) {
		return array.map(callback, thisObject);
	} else {
		var res = [];
		for (var i = 0, len = array.length; i < len; i++) {
			res.push(callback.call(thisObject, array[i], i, array));
		}
		return res;
	}
};

class ColorGrads {
    constructor(props){
        // props = props || {};
        this.SetOptions(props);
        this.StartColor = this.options.StartColor;
        this.EndColor = this.options.EndColor;
        this.Step = Math.abs(this.options.Step);
    }
    SetOptions(props) {
		this.options = {
            // 默认值
            // 开始颜色
            StartColor : "rgb(200,230,255)",
            // 结束颜色
            EndColor : "rgb(0,0,255)",
            // 渐变级数
			Step : 100		
		};
		Object.assign(this.options, props|| {} );
    }
    // 获取渐变颜色集合
	Create () {
        var colors = [];
        var startColor = this.GetColor(this.StartColor);
        var endColor = this.GetColor(this.EndColor), stepR = (endColor[0] - startColor[0])/ this.Step, stepG = (endColor[1] - startColor[1]) / this.Step, stepB = (endColor[2] - startColor[2])/ this.Step;
		// 生成颜色集合
		for (var i = 0, n = this.Step, r = startColor[0], g = startColor[1], b = startColor[2]; i < n; i++) {
			colors.push([ r, g, b ]);
			r += stepR;
			g += stepG;
			b += stepB;
		}
		colors.push(endColor);
		// 修正颜色值
		return Map(colors, function(x) {
			return Map(x, function(x) {
				return Math.min(Math.max(0, Math.floor(x)), 255);
			});
		});
	}
	// 获取颜色数据
	GetColor(color) {
		if (/^#[0-9a-f]{6}$/i.test(color)) {// #rrggbb
			return Map([ color.substr(1, 2), color.substr(3, 2),
					color.substr(5, 2) ], function(x) {
				return parseInt(x, 16);
			});
		} else if (/^#[0-9a-f]{3}$/i.test(color)) {// #rgb
			return Map([ color.substr(1, 1), color.substr(2, 1),
					color.substr(3, 1) ], function(x) {
				return parseInt(x + x, 16);
			});
		} else if (/^rgb(.*)$/i.test(color)) {// rgb(n,n,n) or rgb(n%,n%,n%)
			return Map(color.match(/\d+(\.\d+)?\%?/g), function(x) {
				return parseInt(x.indexOf("%") > 0 ? parseFloat(x, 10) * 2.55
						: x, 10);
			});
		} else {// color
			var mapping = {
				"red" : "#FF0000"
			};// 略
			color = mapping[color.toLowerCase()];
			if (color) {
				return Map([ color.substr(1, 2), color.substr(3, 2),
						color.substr(5, 2) ], function(x) {
					return parseInt(x, 16);
				});
			}
		}
	}
}

export default ColorGrads
