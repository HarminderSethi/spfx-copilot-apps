import { max } from 'd3-array';
import { scaleBand, scaleLinear, scaleSqrt } from 'd3-scale';
import { area, curveMonotoneX, line } from 'd3-shape';
import { serviceData } from '../domain';

export interface ISeriesPoint { readonly label:string; readonly value:number; }
export interface ITrendGeometry { readonly linePath:string; readonly areaPath:string; readonly points:readonly (ISeriesPoint&{readonly x:number;readonly y:number})[]; }
export interface IBarDatum { readonly label:string; readonly value:number; readonly secondary:number; }
export interface IBarGeometry extends IBarDatum { readonly x:number;readonly y:number;readonly width:number;readonly height:number; }
export interface IMatrixDatum { readonly label:string;readonly cost:number;readonly outcome:number;readonly authority:number; }
export interface IMatrixMark extends IMatrixDatum { readonly x:number;readonly y:number;readonly radius:number; }
export interface INodeDatum { readonly id:string;readonly group:string;readonly weight:number;readonly angle:number; }
export interface INodeMark extends INodeDatum { readonly x:number;readonly y:number;readonly radius:number; }

const LEFT=48;const RIGHT=612;const TOP=24;const BOTTOM=194;
export const buildTrendGeometry=(series:readonly ISeriesPoint[],domainMax:number):ITrendGeometry=>{
  const x=scaleLinear().domain([0,series.length-1]).range([LEFT,RIGHT]);
  const y=scaleLinear().domain([0,domainMax]).range([BOTTOM,TOP]);
  const points=series.map((point,index)=>({...point,x:x(index),y:y(point.value)}));
  const path=line<typeof points[number]>().x(point=>point.x).y(point=>point.y).curve(curveMonotoneX);
  const field=area<typeof points[number]>().x(point=>point.x).y0(BOTTOM).y1(point=>point.y).curve(curveMonotoneX);
  return {linePath:path(points)||'',areaPath:field(points)||'',points};
};
export const buildBars=(items:readonly IBarDatum[]):readonly IBarGeometry[]=>{
  const x=scaleBand().domain(items.map(item=>item.label)).range([LEFT,RIGHT]).padding(.3);
  const y=scaleLinear().domain([0,max(items,item=>item.value)||1]).nice().range([BOTTOM,TOP]);
  return items.map(item=>({...item,x:x(item.label)||LEFT,y:y(item.value),width:x.bandwidth(),height:BOTTOM-y(item.value)}));
};
export const buildMatrix=(items:readonly IMatrixDatum[]):readonly IMatrixMark[]=>{
  const x=scaleLinear().domain([0,max(items,item=>item.cost)||1]).nice().range([LEFT,RIGHT]);
  const y=scaleLinear().domain([25,100]).range([BOTTOM,TOP]);
  const radius=scaleSqrt().domain([0,100]).range([9,25]);
  return items.map(item=>({...item,x:x(item.cost),y:y(item.outcome),radius:radius(item.authority)}));
};
export const buildConstellation=(items:readonly INodeDatum[]):readonly INodeMark[]=>{
  const customer=serviceData.getAggregate().customers.find(item=>item.name===items[0]?.id);
  const resolved=customer?[items[0],...customer.constellation.map(item=>({id:item.label,group:item.kind,weight:item.weight,angle:item.angle}))]:items;
  const radius=scaleSqrt().domain([0,100]).range([12,31]);
  return resolved.map(item=>{const radians=item.angle*Math.PI/180;const orbit=item.group==='customer'?0:item.group==='commitment'?92:142;return {...item,x:330+Math.cos(radians)*orbit*1.45,y:116+Math.sin(radians)*orbit,radius:radius(item.weight)};});
};
