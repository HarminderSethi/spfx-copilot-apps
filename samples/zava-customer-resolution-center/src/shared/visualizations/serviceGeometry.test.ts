import { buildBars, buildConstellation, buildMatrix, buildTrendGeometry } from './serviceGeometry';

describe('service visualization geometry',()=>{
  it('changes trend paths when service demand changes',()=>{const first=buildTrendGeometry([{label:'A',value:20},{label:'B',value:40}],100);const second=buildTrendGeometry([{label:'A',value:20},{label:'B',value:80}],100);expect(first.linePath).not.toBe(second.linePath);});
  it('uses one stable bar baseline and positive dimensions',()=>{const bars=buildBars([{label:'A',value:10,secondary:20},{label:'B',value:30,secondary:40}]);expect(bars.every(item=>item.height>0&&item.width>0)).toBe(true);expect(bars[1].height).toBeGreaterThan(bars[0].height);});
  it('moves recovery outcomes independently from cost',()=>{const marks=buildMatrix([{label:'A',cost:1000,outcome:50,authority:20},{label:'B',cost:1000,outcome:80,authority:60}]);expect(marks[0].x).toBe(marks[1].x);expect(marks[0].y).not.toBe(marks[1].y);});
  it('keeps customer at the constellation center',()=>{const marks=buildConstellation([{id:'hero',group:'customer',weight:100,angle:0},{id:'promise',group:'commitment',weight:50,angle:90}]);expect(marks[0].x).toBe(330);expect(marks[0].y).toBe(116);expect(marks[1].y).toBeGreaterThan(116);});
  it('resolves distinct customer-owned constellation geometry',()=>{const alpine=buildConstellation([{id:'Alpine House',group:'customer',weight:100,angle:0}]);const northwind=buildConstellation([{id:'Northwind Traders',group:'customer',weight:100,angle:0}]);expect(alpine.map(item=>item.id)).not.toEqual(northwind.map(item=>item.id));expect(alpine.slice(1).map(item=>[item.x,item.y])).not.toEqual(northwind.slice(1).map(item=>[item.x,item.y]));});
});
