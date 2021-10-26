function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) {
		return unescape(r[2]);
	}
	return null;
};

function utf16to8(str) {
	var out, i, len, c;
	out = "";
	len = str.length;
	for (i = 0; i < len; i++) {
		c = str.charCodeAt(i);
		if ((c >= 0x0001) && (c <= 0x007F)) {
			out += str.charAt(i);
		} else if (c > 0x07FF) {
			out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
			out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
			out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
		} else {
			out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
			out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
		}
	}
	return out;
}

//检测jquery是否加载好
if (typeof jQuery == 'undefined') {
	setTimeout(function() {
		qrloadjs()
	}, 1500);

} else {

	(function(r) {
		r.fn.qrcode = function(h) {
			var s;

			function u(a) {
				this.mode = s;
				this.data = a
			}

			function o(a, c) {
				this.typeNumber = a;
				this.errorCorrectLevel = c;
				this.modules = null;
				this.moduleCount = 0;
				this.dataCache = null;
				this.dataList = []
			}

			function q(a, c) {
				if (void 0 == a.length) throw Error(a.length + "/" + c);
				for (var d = 0; d < a.length && 0 == a[d];) d++;
				this.num = Array(a.length - d + c);
				for (var b = 0; b < a.length - d; b++) this.num[b] = a[b + d]
			}

			function p(a, c) {
				this.totalCount = a;
				this.dataCount = c
			}

			function t() {
				this.buffer = [];
				this.length = 0
			}
			u.prototype = {
				getLength: function() {
					return this.data.length
				},
				write: function(a) {
					for (var c = 0; c < this.data.length; c++) a.put(this.data.charCodeAt(c), 8)
				}
			};
			o.prototype = {
				addData: function(a) {
					this.dataList.push(new u(a));
					this.dataCache = null
				},
				isDark: function(a, c) {
					if (0 > a || this.moduleCount <= a || 0 > c || this.moduleCount <= c) throw Error(a + "," + c);
					return this.modules[a][c]
				},
				getModuleCount: function() {
					return this.moduleCount
				},
				make: function() {
					if (1 > this.typeNumber) {
						for (var a = 1,
								a = 1; 40 > a; a++) {
							for (var c = p.getRSBlocks(a, this.errorCorrectLevel), d = new t, b = 0, e = 0; e < c.length; e++) b += c[e].dataCount;
							for (e = 0; e < this.dataList.length; e++) c = this.dataList[e],
							d.put(c.mode, 4),
							d.put(c.getLength(), j.getLengthInBits(c.mode, a)),
							c.write(d);
							if (d.getLengthInBits() <= 8 * b) break
						}
						this.typeNumber = a
					}
					this.makeImpl(!1, this.getBestMaskPattern())
				},
				makeImpl: function(a, c) {
					this.moduleCount = 4 * this.typeNumber + 17;
					this.modules = Array(this.moduleCount);
					for (var d = 0; d < this.moduleCount; d++) {
						this.modules[d] = Array(this.moduleCount);
						for (var b = 0; b < this.moduleCount; b++) this.modules[d][b] = null
					}
					this.setupPositionProbePattern(0, 0);
					this.setupPositionProbePattern(this.moduleCount - 7, 0);
					this.setupPositionProbePattern(0, this.moduleCount - 7);
					this.setupPositionAdjustPattern();
					this.setupTimingPattern();
					this.setupTypeInfo(a, c);
					7 <= this.typeNumber && this.setupTypeNumber(a);
					null == this.dataCache && (this.dataCache = o.createData(this.typeNumber, this.errorCorrectLevel, this.dataList));
					this.mapData(this.dataCache, c)
				},
				setupPositionProbePattern: function(a, c) {
					for (var d = -1; 7 >= d; d++)
						if (!(-1 >= a + d || this.moduleCount <= a + d))
							for (var b = -1; 7 >= b; b++) - 1 >= c + b || this.moduleCount <= c + b || (this.modules[a + d][c + b] = 0 <= d && 6 >= d && (0 == b || 6 == b) || 0 <= b && 6 >= b && (0 == d || 6 == d) || 2 <= d && 4 >= d && 2 <= b && 4 >= b ? !0 : !1)
				},
				getBestMaskPattern: function() {
					for (var a = 0,
							c = 0,
							d = 0; 8 > d; d++) {
						this.makeImpl(!0, d);
						var b = j.getLostPoint(this);
						if (0 == d || a > b) a = b,
						c = d
					}
					return c
				},
				createMovieClip: function(a, c, d) {
					a = a.createEmptyMovieClip(c, d);
					this.make();
					for (c = 0; c < this.modules.length; c++)
						for (var d = 1 * c,
								b = 0; b < this.modules[c].length; b++) {
							var e = 1 * b;
							this.modules[c][b] && (a.beginFill(0, 100), a.moveTo(e, d), a.lineTo(e + 1, d), a.lineTo(e + 1, d + 1), a.lineTo(e, d + 1), a.endFill())
						}
					return a
				},
				setupTimingPattern: function() {
					for (var a = 8; a < this.moduleCount - 8; a++) null == this.modules[a][6] && (this.modules[a][6] = 0 == a % 2);
					for (a = 8; a < this.moduleCount - 8; a++) null == this.modules[6][a] && (this.modules[6][a] = 0 == a % 2)
				},
				setupPositionAdjustPattern: function() {
					for (var a = j.getPatternPosition(this.typeNumber), c = 0; c < a.length; c++)
						for (var d = 0; d < a.length; d++) {
							var b = a[c],
								e = a[d];
							if (null == this.modules[b][e])
								for (var f = -2; 2 >= f; f++)
									for (var i = -2; 2 >= i; i++) this.modules[b + f][e + i] = -2 == f || 2 == f || -2 == i || 2 == i || 0 == f && 0 == i ? !0 : !1
						}
				},
				setupTypeNumber: function(a) {
					for (var c = j.getBCHTypeNumber(this.typeNumber), d = 0; 18 > d; d++) {
						var b = !a && 1 == (c >> d & 1);
						this.modules[Math.floor(d / 3)][d % 3 + this.moduleCount - 8 - 3] = b
					}
					for (d = 0; 18 > d; d++) b = !a && 1 == (c >> d & 1),
					this.modules[d % 3 + this.moduleCount - 8 - 3][Math.floor(d / 3)] = b
				},
				setupTypeInfo: function(a, c) {
					for (var d = j.getBCHTypeInfo(this.errorCorrectLevel << 3 | c), b = 0; 15 > b; b++) {
						var e = !a && 1 == (d >> b & 1);
						6 > b ? this.modules[b][8] = e : 8 > b ? this.modules[b + 1][8] = e : this.modules[this.moduleCount - 15 + b][8] = e
					}
					for (b = 0; 15 > b; b++) e = !a && 1 == (d >> b & 1),
					8 > b ? this.modules[8][this.moduleCount - b - 1] = e : 9 > b ? this.modules[8][15 - b - 1 + 1] = e : this.modules[8][15 - b - 1] = e;
					this.modules[this.moduleCount - 8][8] = !a
				},
				mapData: function(a, c) {
					for (var d = -1,
							b = this.moduleCount - 1,
							e = 7,
							f = 0,
							i = this.moduleCount - 1; 0 < i; i -= 2)
						for (6 == i && i--;;) {
							for (var g = 0; 2 > g; g++)
								if (null == this.modules[b][i - g]) {
									var n = !1;
									f < a.length && (n = 1 == (a[f] >>> e & 1));
									j.getMask(c, b, i - g) && (n = !n);
									this.modules[b][i - g] = n;
									e--; - 1 == e && (f++, e = 7)
								}
							b += d;
							if (0 > b || this.moduleCount <= b) {
								b -= d;
								d = -d;
								break
							}
						}
				}
			};
			o.PAD0 = 236;
			o.PAD1 = 17;
			o.createData = function(a, c, d) {
				for (var c = p.getRSBlocks(a, c), b = new t, e = 0; e < d.length; e++) {
					var f = d[e];
					b.put(f.mode, 4);
					b.put(f.getLength(), j.getLengthInBits(f.mode, a));
					f.write(b)
				}
				for (e = a = 0; e < c.length; e++) a += c[e].dataCount;
				if (b.getLengthInBits() > 8 * a) throw Error("code length overflow. (" + b.getLengthInBits() + ">" + 8 * a + ")");
				for (b.getLengthInBits() + 4 <= 8 * a && b.put(0, 4); 0 != b.getLengthInBits() % 8;) b.putBit(!1);
				for (; !(b.getLengthInBits() >= 8 * a);) {
					b.put(o.PAD0, 8);
					if (b.getLengthInBits() >= 8 * a) break;
					b.put(o.PAD1, 8)
				}
				return o.createBytes(b, c)
			};
			o.createBytes = function(a, c) {
				for (var d = 0,
						b = 0,
						e = 0,
						f = Array(c.length), i = Array(c.length), g = 0; g < c.length; g++) {
					var n = c[g].dataCount,
						h = c[g].totalCount - n,
						b = Math.max(b, n),
						e = Math.max(e, h);
					f[g] = Array(n);
					for (var k = 0; k < f[g].length; k++) f[g][k] = 255 & a.buffer[k + d];
					d += n;
					k = j.getErrorCorrectPolynomial(h);
					n = (new q(f[g], k.getLength() - 1)).mod(k);
					i[g] = Array(k.getLength() - 1);
					for (k = 0; k < i[g].length; k++) h = k + n.getLength() - i[g].length,
					i[g][k] = 0 <= h ? n.get(h) : 0
				}
				for (k = g = 0; k < c.length; k++) g += c[k].totalCount;
				d = Array(g);
				for (k = n = 0; k < b; k++)
					for (g = 0; g < c.length; g++) k < f[g].length && (d[n++] = f[g][k]);
				for (k = 0; k < e; k++)
					for (g = 0; g < c.length; g++) k < i[g].length && (d[n++] = i[g][k]);
				return d
			};
			s = 4;
			for (var j = {
					PATTERN_POSITION_TABLE: [
						[],
						[6, 18],
						[6, 22],
						[6, 26],
						[6, 30],
						[6, 34],
						[6, 22, 38],
						[6, 24, 42],
						[6, 26, 46],
						[6, 28, 50],
						[6, 30, 54],
						[6, 32, 58],
						[6, 34, 62],
						[6, 26, 46, 66],
						[6, 26, 48, 70],
						[6, 26, 50, 74],
						[6, 30, 54, 78],
						[6, 30, 56, 82],
						[6, 30, 58, 86],
						[6, 34, 62, 90],
						[6, 28, 50, 72, 94],
						[6, 26, 50, 74, 98],
						[6, 30, 54, 78, 102],
						[6, 28, 54, 80, 106],
						[6, 32, 58, 84, 110],
						[6, 30, 58, 86, 114],
						[6, 34, 62, 90, 118],
						[6, 26, 50, 74, 98, 122],
						[6, 30, 54, 78, 102, 126],
						[6, 26, 52, 78, 104, 130],
						[6, 30, 56, 82, 108, 134],
						[6, 34, 60, 86, 112, 138],
						[6, 30, 58, 86, 114, 142],
						[6, 34, 62, 90, 118, 146],
						[6, 30, 54, 78, 102, 126, 150],
						[6, 24, 50, 76, 102, 128, 154],
						[6, 28, 54, 80, 106, 132, 158],
						[6, 32, 58, 84, 110, 136, 162],
						[6, 26, 54, 82, 110, 138, 166],
						[6, 30, 58, 86, 114, 142, 170]
					],
					G15: 1335,
					G18: 7973,
					G15_MASK: 21522,
					getBCHTypeInfo: function(a) {
						for (var c = a << 10; 0 <= j.getBCHDigit(c) - j.getBCHDigit(j.G15);) c ^= j.G15 << j.getBCHDigit(c) - j.getBCHDigit(j.G15);
						return (a << 10 | c) ^ j.G15_MASK
					},
					getBCHTypeNumber: function(a) {
						for (var c = a << 12; 0 <= j.getBCHDigit(c) - j.getBCHDigit(j.G18);) c ^= j.G18 << j.getBCHDigit(c) - j.getBCHDigit(j.G18);
						return a << 12 | c
					},
					getBCHDigit: function(a) {
						for (var c = 0; 0 != a;) c++,
						a >>>= 1;
						return c
					},
					getPatternPosition: function(a) {
						return j.PATTERN_POSITION_TABLE[a - 1]
					},
					getMask: function(a, c, d) {
						switch (a) {
							case 0:
								return 0 == (c + d) % 2;
							case 1:
								return 0 == c % 2;
							case 2:
								return 0 == d % 3;
							case 3:
								return 0 == (c + d) % 3;
							case 4:
								return 0 == (Math.floor(c / 2) + Math.floor(d / 3)) % 2;
							case 5:
								return 0 == c * d % 2 + c * d % 3;
							case 6:
								return 0 == (c * d % 2 + c * d % 3) % 2;
							case 7:
								return 0 == (c * d % 3 + (c + d) % 2) % 2;
							default:
								throw Error("bad maskPattern:" + a);
						}
					},
					getErrorCorrectPolynomial: function(a) {
						for (var c = new q([1], 0), d = 0; d < a; d++) c = c.multiply(new q([1, l.gexp(d)], 0));
						return c
					},
					getLengthInBits: function(a, c) {
						if (1 <= c && 10 > c) switch (a) {
							case 1:
								return 10;
							case 2:
								return 9;
							case s:
								return 8;
							case 8:
								return 8;
							default:
								throw Error("mode:" + a);
						} else if (27 > c) switch (a) {
							case 1:
								return 12;
							case 2:
								return 11;
							case s:
								return 16;
							case 8:
								return 10;
							default:
								throw Error("mode:" + a);
						} else if (41 > c) switch (a) {
							case 1:
								return 14;
							case 2:
								return 13;
							case s:
								return 16;
							case 8:
								return 12;
							default:
								throw Error("mode:" + a);
						} else throw Error("type:" + c);
					},
					getLostPoint: function(a) {
						for (var c = a.getModuleCount(), d = 0, b = 0; b < c; b++)
							for (var e = 0; e < c; e++) {
								for (var f = 0,
										i = a.isDark(b, e), g = -1; 1 >= g; g++)
									if (!(0 > b + g || c <= b + g))
										for (var h = -1; 1 >= h; h++) 0 > e + h || c <= e + h || 0 == g && 0 == h || i == a.isDark(b + g, e + h) && f++;
								5 < f && (d += 3 + f - 5)
							}
						for (b = 0; b < c - 1; b++)
							for (e = 0; e < c - 1; e++)
								if (f = 0, a.isDark(b, e) && f++, a.isDark(b + 1, e) && f++, a.isDark(b, e + 1) && f++, a.isDark(b + 1, e + 1) && f++, 0 == f || 4 == f) d += 3;
						for (b = 0; b < c; b++)
							for (e = 0; e < c - 6; e++) a.isDark(b, e) && !a.isDark(b, e + 1) && a.isDark(b, e + 2) && a.isDark(b, e + 3) && a.isDark(b, e + 4) && !a.isDark(b, e + 5) && a.isDark(b, e + 6) && (d += 40);
						for (e = 0; e < c; e++)
							for (b = 0; b < c - 6; b++) a.isDark(b, e) && !a.isDark(b + 1, e) && a.isDark(b + 2, e) && a.isDark(b + 3, e) && a.isDark(b + 4, e) && !a.isDark(b + 5, e) && a.isDark(b + 6, e) && (d += 40);
						for (e = f = 0; e < c; e++)
							for (b = 0; b < c; b++) a.isDark(b, e) && f++;
						a = Math.abs(100 * f / c / c - 50) / 5;
						return d + 10 * a
					}
				},
					l = {
						glog: function(a) {
							if (1 > a) throw Error("glog(" + a + ")");
							return l.LOG_TABLE[a]
						},
						gexp: function(a) {
							for (; 0 > a;) a += 255;
							for (; 256 <= a;) a -= 255;
							return l.EXP_TABLE[a]
						},
						EXP_TABLE: Array(256),
						LOG_TABLE: Array(256)
					},
					m = 0; 8 > m; m++) l.EXP_TABLE[m] = 1 << m;
			for (m = 8; 256 > m; m++) l.EXP_TABLE[m] = l.EXP_TABLE[m - 4] ^ l.EXP_TABLE[m - 5] ^ l.EXP_TABLE[m - 6] ^ l.EXP_TABLE[m - 8];
			for (m = 0; 255 > m; m++) l.LOG_TABLE[l.EXP_TABLE[m]] = m;
			q.prototype = {
				get: function(a) {
					return this.num[a]
				},
				getLength: function() {
					return this.num.length
				},
				multiply: function(a) {
					for (var c = Array(this.getLength() + a.getLength() - 1), d = 0; d < this.getLength(); d++)
						for (var b = 0; b < a.getLength(); b++) c[d + b] ^= l.gexp(l.glog(this.get(d)) + l.glog(a.get(b)));
					return new q(c, 0)
				},
				mod: function(a) {
					if (0 > this.getLength() - a.getLength()) return this;
					for (var c = l.glog(this.get(0)) - l.glog(a.get(0)), d = Array(this.getLength()), b = 0; b < this.getLength(); b++) d[b] = this.get(b);
					for (b = 0; b < a.getLength(); b++) d[b] ^= l.gexp(l.glog(a.get(b)) + c);
					return (new q(d, 0)).mod(a)
				}
			};
			p.RS_BLOCK_TABLE = [
				[1, 26, 19],
				[1, 26, 16],
				[1, 26, 13],
				[1, 26, 9],
				[1, 44, 34],
				[1, 44, 28],
				[1, 44, 22],
				[1, 44, 16],
				[1, 70, 55],
				[1, 70, 44],
				[2, 35, 17],
				[2, 35, 13],
				[1, 100, 80],
				[2, 50, 32],
				[2, 50, 24],
				[4, 25, 9],
				[1, 134, 108],
				[2, 67, 43],
				[2, 33, 15, 2, 34, 16],
				[2, 33, 11, 2, 34, 12],
				[2, 86, 68],
				[4, 43, 27],
				[4, 43, 19],
				[4, 43, 15],
				[2, 98, 78],
				[4, 49, 31],
				[2, 32, 14, 4, 33, 15],
				[4, 39, 13, 1, 40, 14],
				[2, 121, 97],
				[2, 60, 38, 2, 61, 39],
				[4, 40, 18, 2, 41, 19],
				[4, 40, 14, 2, 41, 15],
				[2, 146, 116],
				[3, 58, 36, 2, 59, 37],
				[4, 36, 16, 4, 37, 17],
				[4, 36, 12, 4, 37, 13],
				[2, 86, 68, 2, 87, 69],
				[4, 69, 43, 1, 70, 44],
				[6, 43, 19, 2, 44, 20],
				[6, 43, 15, 2, 44, 16],
				[4, 101, 81],
				[1, 80, 50, 4, 81, 51],
				[4, 50, 22, 4, 51, 23],
				[3, 36, 12, 8, 37, 13],
				[2, 116, 92, 2, 117, 93],
				[6, 58, 36, 2, 59, 37],
				[4, 46, 20, 6, 47, 21],
				[7, 42, 14, 4, 43, 15],
				[4, 133, 107],
				[8, 59, 37, 1, 60, 38],
				[8, 44, 20, 4, 45, 21],
				[12, 33, 11, 4, 34, 12],
				[3, 145, 115, 1, 146, 116],
				[4, 64, 40, 5, 65, 41],
				[11, 36, 16, 5, 37, 17],
				[11, 36, 12, 5, 37, 13],
				[5, 109, 87, 1, 110, 88],
				[5, 65, 41, 5, 66, 42],
				[5, 54, 24, 7, 55, 25],
				[11, 36, 12],
				[5, 122, 98, 1, 123, 99],
				[7, 73, 45, 3, 74, 46],
				[15, 43, 19, 2, 44, 20],
				[3, 45, 15, 13, 46, 16],
				[1, 135, 107, 5, 136, 108],
				[10, 74, 46, 1, 75, 47],
				[1, 50, 22, 15, 51, 23],
				[2, 42, 14, 17, 43, 15],
				[5, 150, 120, 1, 151, 121],
				[9, 69, 43, 4, 70, 44],
				[17, 50, 22, 1, 51, 23],
				[2, 42, 14, 19, 43, 15],
				[3, 141, 113, 4, 142, 114],
				[3, 70, 44, 11, 71, 45],
				[17, 47, 21, 4, 48, 22],
				[9, 39, 13, 16, 40, 14],
				[3, 135, 107, 5, 136, 108],
				[3, 67, 41, 13, 68, 42],
				[15, 54, 24, 5, 55, 25],
				[15, 43, 15, 10, 44, 16],
				[4, 144, 116, 4, 145, 117],
				[17, 68, 42],
				[17, 50, 22, 6, 51, 23],
				[19, 46, 16, 6, 47, 17],
				[2, 139, 111, 7, 140, 112],
				[17, 74, 46],
				[7, 54, 24, 16, 55, 25],
				[34, 37, 13],
				[4, 151, 121, 5, 152, 122],
				[4, 75, 47, 14, 76, 48],
				[11, 54, 24, 14, 55, 25],
				[16, 45, 15, 14, 46, 16],
				[6, 147, 117, 4, 148, 118],
				[6, 73, 45, 14, 74, 46],
				[11, 54, 24, 16, 55, 25],
				[30, 46, 16, 2, 47, 17],
				[8, 132, 106, 4, 133, 107],
				[8, 75, 47, 13, 76, 48],
				[7, 54, 24, 22, 55, 25],
				[22, 45, 15, 13, 46, 16],
				[10, 142, 114, 2, 143, 115],
				[19, 74, 46, 4, 75, 47],
				[28, 50, 22, 6, 51, 23],
				[33, 46, 16, 4, 47, 17],
				[8, 152, 122, 4, 153, 123],
				[22, 73, 45, 3, 74, 46],
				[8, 53, 23, 26, 54, 24],
				[12, 45, 15, 28, 46, 16],
				[3, 147, 117, 10, 148, 118],
				[3, 73, 45, 23, 74, 46],
				[4, 54, 24, 31, 55, 25],
				[11, 45, 15, 31, 46, 16],
				[7, 146, 116, 7, 147, 117],
				[21, 73, 45, 7, 74, 46],
				[1, 53, 23, 37, 54, 24],
				[19, 45, 15, 26, 46, 16],
				[5, 145, 115, 10, 146, 116],
				[19, 75, 47, 10, 76, 48],
				[15, 54, 24, 25, 55, 25],
				[23, 45, 15, 25, 46, 16],
				[13, 145, 115, 3, 146, 116],
				[2, 74, 46, 29, 75, 47],
				[42, 54, 24, 1, 55, 25],
				[23, 45, 15, 28, 46, 16],
				[17, 145, 115],
				[10, 74, 46, 23, 75, 47],
				[10, 54, 24, 35, 55, 25],
				[19, 45, 15, 35, 46, 16],
				[17, 145, 115, 1, 146, 116],
				[14, 74, 46, 21, 75, 47],
				[29, 54, 24, 19, 55, 25],
				[11, 45, 15, 46, 46, 16],
				[13, 145, 115, 6, 146, 116],
				[14, 74, 46, 23, 75, 47],
				[44, 54, 24, 7, 55, 25],
				[59, 46, 16, 1, 47, 17],
				[12, 151, 121, 7, 152, 122],
				[12, 75, 47, 26, 76, 48],
				[39, 54, 24, 14, 55, 25],
				[22, 45, 15, 41, 46, 16],
				[6, 151, 121, 14, 152, 122],
				[6, 75, 47, 34, 76, 48],
				[46, 54, 24, 10, 55, 25],
				[2, 45, 15, 64, 46, 16],
				[17, 152, 122, 4, 153, 123],
				[29, 74, 46, 14, 75, 47],
				[49, 54, 24, 10, 55, 25],
				[24, 45, 15, 46, 46, 16],
				[4, 152, 122, 18, 153, 123],
				[13, 74, 46, 32, 75, 47],
				[48, 54, 24, 14, 55, 25],
				[42, 45, 15, 32, 46, 16],
				[20, 147, 117, 4, 148, 118],
				[40, 75, 47, 7, 76, 48],
				[43, 54, 24, 22, 55, 25],
				[10, 45, 15, 67, 46, 16],
				[19, 148, 118, 6, 149, 119],
				[18, 75, 47, 31, 76, 48],
				[34, 54, 24, 34, 55, 25],
				[20, 45, 15, 61, 46, 16]
			];
			p.getRSBlocks = function(a, c) {
				var d = p.getRsBlockTable(a, c);
				if (void 0 == d) throw Error("bad rs block @ typeNumber:" + a + "/errorCorrectLevel:" + c);
				for (var b = d.length / 3,
						e = [], f = 0; f < b; f++)
					for (var h = d[3 * f + 0], g = d[3 * f + 1], j = d[3 * f + 2], l = 0; l < h; l++) e.push(new p(g, j));
				return e
			};
			p.getRsBlockTable = function(a, c) {
				switch (c) {
					case 1:
						return p.RS_BLOCK_TABLE[4 * (a - 1) + 0];
					case 0:
						return p.RS_BLOCK_TABLE[4 * (a - 1) + 1];
					case 3:
						return p.RS_BLOCK_TABLE[4 * (a - 1) + 2];
					case 2:
						return p.RS_BLOCK_TABLE[4 * (a - 1) + 3]
				}
			};
			t.prototype = {
				get: function(a) {
					return 1 == (this.buffer[Math.floor(a / 8)] >>> 7 - a % 8 & 1)
				},
				put: function(a, c) {
					for (var d = 0; d < c; d++) this.putBit(1 == (a >>> c - d - 1 & 1))
				},
				getLengthInBits: function() {
					return this.length
				},
				putBit: function(a) {
					var c = Math.floor(this.length / 8);
					this.buffer.length <= c && this.buffer.push(0);
					a && (this.buffer[c] |= 128 >>> this.length % 8);
					this.length++
				}
			};
			"string" === typeof h && (h = {
				text: h
			});
			h = r.extend({}, {
					render: "canvas",
					width: 256,
					height: 256,
					typeNumber: -1,
					correctLevel: 2,
					background: "#ffffff",
					foreground: "#000000"
				},
				h);
			return this.each(function() {
				var a;
				if ("canvas" == h.render) {
					a = new o(h.typeNumber, h.correctLevel);
					a.addData(h.text);
					a.make();
					var c = document.createElement("canvas");
					c.id = "canvasId";
					c.width = h.width;
					c.height = h.height;
					for (var d = c.getContext("2d"), b = h.width / a.getModuleCount(), e = h.height / a.getModuleCount(), f = 0; f < a.getModuleCount(); f++)
						for (var i = 0; i < a.getModuleCount(); i++) {
							d.fillStyle = a.isDark(f, i) ? h.foreground : h.background;
							var g = Math.ceil((i + 1) * b) - Math.floor(i * b),
								j = Math.ceil((f + 1) * b) - Math.floor(f * b);
							d.fillRect(Math.round(i * b), Math.round(f * e), g, j)
						}
				} else {
					a = new o(h.typeNumber, h.correctLevel);
					a.addData(h.text);
					a.make();
					c = r("<table></table>").css("width", h.width + "px").css("height", h.height + "px").css("border", "0px").css("border-collapse", "collapse").css("background-color", h.background);
					d = h.width / a.getModuleCount();
					b = h.height / a.getModuleCount();
					for (e = 0; e < a.getModuleCount(); e++) {
						f = r("<tr></tr>").css("height", b + "px").appendTo(c);
						for (i = 0; i < a.getModuleCount(); i++) r("<td></td>").css("width", d + "px").css("background-color", a.isDark(e, i) ? h.foreground : h.background).appendTo(f)
					}
				}
				a = c;
				jQuery(a).appendTo(this)
			})
		}
	})(jQuery);




var userId=GetQueryString("userId");
var modelId=GetQueryString("modid");
var gid=GetQueryString("gid");
var modid=GetQueryString("modid");
var skinColor=GetQueryString("skinColor");
var qrurl;var cardQrk;
var CardBoxBid=0;
var puid=GetQueryString("puid");

if (puid)
{
	$(".AddNewCard").attr("href","cardAdd.html?gid=-1&skinColor=30&puid="+puid);
}
            function loadOrgan()
            {
                $.post("/minisns/queryInfo.json", function (data2) 
                {
                    if (data2.rs == "s")
                    {
						showSelf();
						user_id=data2.body.userId;
                        $.cookie("nickName", data2.body.nickName, {
                            expires : 365 
                        });
                        $.cookie("user_id", data2.body.userId, {
                            expires : 365 
                        });
                        $("#nicheng,.nicheng").html(data2.body.nickName );
						var str=data2.body.faceimag;
						if (str&&str.indexOf("http")==0)
						{
						}else{
							str="images.aazj.cn/"+str;
						}
						$(".nicheng").html("<img  src="+str+" style='height:20px'/>").show();
                    }else{
						autologin();
					}
                    //  console.log(data2.nickName);
                },
                'json');
            }
            loadOrgan();

function queryCard(mId){
	if (mId)
	{
		modid=mId;
	}
$.post("/minisns/model/show_list.json", {
                "id" : modid
            },
            function (re)
            {
                if (re.rs == "s")
                {
					console.log(re.data);
                    var info_from = "";
					var memberId=re.data.memberId;
					var str = re.data.headImgUrl;
                        if(!str){
                            str="pub_gface.png"
                        }
						if(str.indexOf("http")>=0){
						}else{
						str = "http://images.aazj.cn/"+str;
						}; 
                    $("#logoimg").attr("src", str);
                    $(".weixintitleimg").attr("src", str);
					$("#logoimg").attr("alt",re.data.modelName);
                    $(".info_from").html(info_from);
                    $(".cpxx .bd .id").text(re.data.id);
                    $(".modelName").text(re.data.modelName);
                    $(".modelName").append("<span style='color: #9E9E9E;'>&nbsp;&nbsp;"+re.data.petName+"</span>");
                    //$(".petName").text(re.data.petName);text=text.replace(/\n/g,"<br/>");//text转换成html
				var modelTagtext=re.data.modelTag;
				modelTagtext=modelTagtext.replace(/\n/g,"<br/>");//text转换成html
                    $(".modelTag").html(modelTagtext);
                    $(".clothSize").html("<a href='tel:"+re.data.clothSize+"'><img src='./img/pic5.png' class='conn'>"+re.data.clothSize+"</a>");
                    $(".humanType").html("<a href='mailto:"+re.data.humanType+"'><img src='./img/mail.png' class='conn'>"+re.data.humanType+"</a>");
                    $(".modelDescribes").html("<img src='./img/pic4.png' class='conn'>"+re.data.modelDescribes);
					var wwwurl=re.data.style;
					if (wwwurl&&wwwurl.indexOf("http")==0)
					{
					}else{
						wwwurl="http://"+wwwurl;
					}
                    $(".style").html("<img src='./img/email1.png' class='conn'><a href='"+wwwurl+"'>"+wwwurl+"</a>");
                    $(".priceDes").html("<img src='./img/pic10.png' class='conn'>"+re.data.priceDes);
                    $(".cpxx .bd .cityName").html("<a href='mtzs.html?skinColor=1&city="+re.data.cityId+"'>"+re.data.cityName+"</a>");
                    $(".cpxx .bd .infoPrice").text(re.data.infoPrice);
                    $(".cpxx .bd .clickRate").text(re.data.clickRate);
                    $(".cpxx .bd .accuracyNum").text(re.data.accuracyNum);
                    //           $(".cpxx .bd .selectNum").text(re.data.selectNum);
                    $(".cpxx .bd .accuracy_rate").text((re.data.accuracyTotal / (re.data.accuracyNum < 1 ? 1 : re.data.accuracyNum)).toFixed(2));
                    //                $(".cpxx .bd .fees").text(re.data.fees);
                    //                $(".cpxx .bd .unitPrice").text(re.data.unitPrice);               

                    var gender = re.data.gender;
                    if (gender == 1) {
                        gender = "男";
                    }
                    else {
                        gender = "女";
                    };
					var skinColor = re.data.skinColor;
					if (skinColor==1)
					{
						skinColor="模特"
					}else if (skinColor==2)
					{
						skinColor="宝贝秀"
					}else if(skinColor==30){
						skinColor="名片";
					}else{
						skinColor="明星"
					}
					
					var cardQrk="MECARD:N:"+re.data.modelName+";TEL:"+re.data.clothSize+";EMAIL:"+re.data.humanType+";ORG:"+re.data.modelTag+";URL:http://www.aazj.cn/pc/meeting/card.html?skinColor=30&modid="+modid+";ADR:"+re.data.modelDescribes+";NOTE:"+re.data.priceDes+";";

					//var cardQrk=encodeURIComponent(encodeURIComponent(cardQrk));
					var logoimg=encodeURIComponent(encodeURIComponent(str));
					
					//qrurl="http://www.aazj.cn/pc/meeting/qr.html?ad="+adurl+"&puid="+userId+"&i="+logoimg+"&qr="+cardQrk;
					qrurl="http://www.aazj.cn/pc/meeting/qr.html?puid="+userId+"&i="+logoimg+"&qr="+cardQrk;
				//	qrurl=encodeURIComponent(encodeURIComponent(qrurl));
					
					
					document.title="【"+re.data.modelName+"】@"+re.data.modelTag;//修改标题
					$(".AddNewCard").attr("href","cardAdd.html?gid=-1&skinColor=30&ReModid="+modid+"&puid="+GetQueryString("puid"));
                  
				}
				queryBlog();
				return qraa(cardQrk);

		
			});
};
queryCard();
function queryBlog(){

                    if (!gid||gid==-1)
                    {
                        var _indata = {
                            userId : userId, modelId : modelId, minRow : 0, maxRow : 999, lastRefreshTime : ""
                        };
                        var _url = "/minisns/queryUserBlogList.json";
                    }
                    else
                    {
                        var _indata = {
                            gid : gid, modelId : modelId, minRow : 0, maxRow : 999, lastRefreshTime : ""
                        };
                        var _url = "/minisns/queryBlogList.json";
                    }
                    $.post(_url, _indata, function (datap)
                    {
                        if (datap.rs == 'f') {
							$("#kong").html("登录可查看相册粉丝")
						}
                        else
                        {
							var mypl=datap.pl;
							$(".imglist").html("");
                            $.each(datap.body.list, function (i, data)
                            {
                                var text = "<p class='' bid='" + data.bid + "'>" + data.content.replace(/[^\u4e00-\u9fa5]/gi,"") + "</p>";
                                var b = data.content.replace(/(<img\s([^>]{0,})>)/gi, function (str, t) 
                                {
									
									 var str=$(t).attr("src")
										if(str.indexOf("http")>=0){
										}else{
										str = "http://images.aazj.cn/"+str;
										};
                                    return '<img bid="' + data.bid + '" class="bbs img-responsive f-mauto" src= "' +str + '"/><div style="border:5px solid #fff"></div>' ;
                                });
                                var content = b.replace(/(<video\s([^>]{0,})>)/gi, function (strv, _t) 
                                {
									 var strv=$(_t).attr("src")
										if(strv.indexOf("http")>=0){
										}else{
										strv = "http://media.aazj.cn/"+strv;
										};
                                    return '<video controls="controls" src= "' +strv + '"></video>' ;
                                });

									var thisuserid=data.userId;
								if (content&&content.indexOf("粉丝签到赞赞")>=0){
									CardBoxBid=data.bid;
								}else{
											if (mypl>=35||thisuserid==$.cookie("user_id"))
											{
											content=content+"<span class='_btn ' onclick=delthisblog(" + data.bid + ")>删除</span>"
											};
											
							
									$(".imglist").append("<div class='"+data.bid+"'><div class='' bid=" + data.bid + " id='bbs" + data.bid + "' style='display:none;'></div>" + content+"</div>");
						}								
						})
						}
					})
}
		
//http://www.javascriptobfuscator.com/Javascript-Obfuscator.aspx混淆
var defautQrimgsize=1;var LiftOrRight=0;var myqrtop=0;var myqrnote=0;var myqrlogimgsrc ="http://images.aazj.cn";var myqrsize="300px";
	function qraa(qrurl) { //网站LOGO正方形图片相对路径
	

		var qr1 = decodeURIComponent(qrurl);
		var qr2 = utf16to8(qr1)
			//  $('#showqr').qrcode(qr2);
		$("#showqr").qrcode({
			render: "canvas",
			width: 300,
			height: 300,
			crossorigin: "anonymous",
			text: qr2,
		});

	function convertCanvasToImage(ctx) {
			var image = new Image();
			//image.crossOrigin = "Anonymous"
			image.id = "qrAnonymous"
			image.src = canvas.toDataURL("image/png");
			return image;
		}

		var canvas = document.getElementById("canvasId");
		var ctx = canvas.getContext("2d");

//var logoimg=document.getElementById("logoimg");
	//var logimgheight=$("#logoimg").height()
	//	var thiswwwurl = document.domain.split(".").slice(-2).join(".");
		//ctx.drawImage(logoimg,115,115,50,50);
		//	ctx.drawImage(logoimg, myqrsize * 5 / 12, myqrsize * 5 / 12, myqrsize / 6, myqrsize / 6);
		
		//	var ctx = canvas.getContext('2d');
			var imgsrc = convertCanvasToImage(ctx)
			//$("#canvasId").remove();
			$("#showqr").html("<img src='"+imgsrc.src+"' style=''/>");
			$('#showqr').append('<div id="somenews" style="display:none;z-index:1;width:320px; height:160px;'+LiftOrRight+myqrtop+'"><iframe height=100% width=100% src="https://images.aazj.cn/js/qrAd.html" frameborder=0 allowfullscreen></iframe></div>');//广告

		if (defautQrimgsize&&defautQrimgsize=='1')//初始大小
		{
		var width = myqrsize ;
		var height = myqrsize ;
		}else{
		var width = myqrsize / 6;
		var height = myqrsize / 6;
		}
		$("#qrAnonymous").css({
			"height": height,
			"width": width
		})
		$("#canvasId").css({
			"height": height,
			"width": width
		})
				return imgsrc;
	};
			
function showSelf(){
	
            var url = "/minisns/model/show_lib_list.json";
            var indata = {
                gid : "", pageNow : 1, pageSize : 16
            };
            $.post(url, indata, function (re)
            {
                if (re.count > 0)
                {
					
                    $.each(re.list, function (i, data)
                    {
						var str = data.headImgUrl;
                        if(!str){
                            str="pub_gface.png"
                        }
						if(str.indexOf("http")>=0){
						}else{
						str = "http://images.aazj.cn/"+str;
						};     
                        var Id = data.id;
												
						if (data.status==0)
							{
								var status="<div class='col-xs-2 panel-body'>隐</div>";
							}else{
								var status="<div class='col-xs-2 panel-body'> 显</div>";
							}
								//var modshow="<div class='col-xs-4 myself'><a href='card.html?modid=" + Id + "&puid="+$.cookie("user_id")+"&skinColor=30' class='tomtxq' type_=1 modid='" + Id + "' skinColor='"+data.skinColor+"' ><p class='f-ff1'style= 'position: absolute;  bottom: 0px;color:#000000;text-shadow:1px 1px 0 rgba(179, 234, 59, 1);'>点击修改" + Id + status+ "&nbsp;|&nbsp;" + data.modelName + "</p><img src='" + str + "' class='img-responsive pic f-db'></a>"+upimage+"</div>"
						var showSelf="<a href='card.html?modid=" + Id + "&puid="+$.cookie("user_id")+"&skinColor=30' type_=1 modid='" + Id + "' skinColor='"+data.skinColor+"' ><li class='col-xs-12  myself'><div class='col-xs-2'><img src='" + str + "' class='img-logo pic'></div><div class='col-xs-8 panel-body'>"+data.modelTag+"</div>"+status+"</li></a>"
						var sendCard="<a href='javascript:void(0);' onclick=sendCard(" + Id + ");  ><ul class='col-xs-12  myself'><li class='col-xs-2'><img src='" + str + "' class='img-logo pic'></li><li class='col-xs-8 panel-body'>"+data.modelTag+"</li><li class='col-xs-2 panel-body pull-right'>立即发送</li></ul>"
						sendCard += "<div class='"+Id+"' style='display:none;'><a href='javascript:void(0);'  class='" + Id + "' onclick=ShowSendedCard(" + Id + ")><ul class='col-xs-12  myself'><li class='col-xs-2'><img src='" + str + "' class='img-logo pic' style='height:40px;'></li><li class='col-xs-4 panel-body'>"+data.modelName+"</li><li class='col-xs-6 panel-body pull-right'>"+data.clothSize+"</li></ul></a>"
						sendCard += "<div class='qr"+Id+" col-xs-12  panel-body' style='display:none;'>"+data.modelTag+"</div></div>"
						if (data.skinColor==30)
						{
						$(".showSelf").append(showSelf);
						$(".sendCard").append(sendCard);
						}
						if (Id==modid)
						{
					$(".addweibo").after('<a class="btn btn-success btn-sm pull-right " href="javascript:void(0);" onclick=QuerySendMe();  style="">查看回赠 »</a>').show();
					$(".addweibo").attr("href","addweibo.html?modelId="+modelId+"&gid="+gid+"&skinColor="+skinColor);
											
					$(".reCard").hide();
						$(".edit").attr("href","cardAdd.html?yid="+modid+"&skinColor=30&mygid=-1");
						$(".edit").show();
					


						}
                    });
                };
            });
};

function QuerySendMe(){
	
	if (CardBoxBid)
	{
	$.post("/minisns/queryBlogReplyList.json", {
          bid : CardBoxBid, minRow : 0, maxRow : 200, lastRefreshTime : ""
         },
          function (data) {	
			 $("#SendMe").html("");
                                            $.each(data.body.list, function (i, data)
                                            {
                                                var text = data.content.replace(/[^\u4e00-\u9fa5]/gi, 
                                                "");
                                                var b = data.content.replace(/(<img\s([^>]{0,})>)/gi, function (str, t) 
                                                {
                                                    return '<div style="border:5px solid #fff"></div><img class="img-responsive f-mauto" src= ' + $(t).attr("src") + '>' ;
                                                });
                                                var content = b.replace(/(<video\s([^>]{0,})>)/gi, function (_str, _t) 
                                                {
                                                    return '<video controls="controls" src= ' + 'http://media.aazj.cn/' + $(_t).attr("src") + '></video>'//var content += "<div>"+content+"</div>";
                                                });
													var str =  data.memberFacePath;
													if (!str)
													{
														str="pub_gface_2.png"
													}
													if((str)&&(str.indexOf("http"))>=0){
													}else{
													str = "http://images.aazj.cn/"+str;
													};
													
													$("#SendMe").append("<div class='" + data.replyId +"' onclick=$('.re" + data.replyId +"').show()>"+content+
														"<div class='col-xs-12  panel-body delthisReplyId' style='text-align:center;'><button type='button' class='alert-warning btn btn-default btn-sm qr"+CardBoxBid+" re" + data.replyId + " panel-body delthisReplyId' onclick=delReplay(" + data.replyId + ") style='display:none;'>删除名片</butten></div></div>");
                                            });
											$("#SendMe").show();
		 })
	}else{
			 alert("no card")
		 }
}

function ShowSendCard(){
	
var ShowSendCarddisply=$('#ShowSendCard').css('display');
if(ShowSendCarddisply != "block" ){
$("#ShowSendCard").css("display","block");
}else{
$("#ShowSendCard").css("display","none");
}
}
function sendCard(Id){
	var sendModid=$(this).attr("modid");
	var ssss=$("."+Id).html();
//	alert(ssss);
	if (CardBoxBid)
	{
		$.post("/minisns/replyBlog.json",{type:"5555",bid:CardBoxBid,context:ssss,permissionSet:6},function(data){
			if(data.rs=="s"){
				alert("ok，已经收到");
				}
		})
	}else{
			alert("不接受名片");
		}
}

function ShowSendedCard(modelId){
$(".qr"+modelId).show();
$("#showqr").attr("id","temp");
$("#logoimg").attr("id","templogoimg");
$(".qr"+modelId).html("<div class='delthisReplyId' style='text-align:center;'><a href='http://www.aazj.cn/pc/meeting/card.html?modid="+modelId+"&skinColor=30'>看名片</a>长按识别二维码保存到手机通讯录</div><img src='./img/close.png'  onclick=$(this).hide();$('.delthisReplyId').hide();$('#showqr').hide(); style='float:right' />"+
	"<div id='showqr' class='panel-body center-block' style='text-align: center;'><img src='' id='logoimg' style='display:none;'/></div>")
queryCard(modelId);
}

function delthisblog(bid){
 	 var data={bid:bid};
	 $.post("/minisns/delBlog.json",data,function(re){
	  $("."+bid).remove();
	  
	 });
}
function delReplay(bid){
	$.post("/minisns/delRelyBlog.json",{bid:bid},function(data){
		if (data.rs=="s")
		{
			$("."+bid).remove();//alert("ok")
		}
	})
}
		//点logo缩放
            $("#cardImg").on("click", function (){
				var divwidth= $(this).width();
				if (divwidth>=250)
				{
				$("#cardImg").css({
					"height": 60,
					"width": 60,
						"top":130,
						"left":"45%"
				})
				}else{
				$("#cardImg").css({
					"height": 320,
					"width": 320,
						"top":0,
						"left":"7%"
				})
				}
			})
}