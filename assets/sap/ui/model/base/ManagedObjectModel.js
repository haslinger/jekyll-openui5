/*
 * ! UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','../json/JSONModel','../json/JSONPropertyBinding','../json/JSONListBinding','sap/ui/base/ManagedObject','sap/ui/base/ManagedObjectObserver','../Context','../ChangeReason'],function(q,J,a,b,M,c,C,d){"use strict";var e=b.extend("sap.ui.model.base.ManagedObjectModelAggregationBinding"),f=a.extend("sap.ui.model.base.ManagedObjectModelPropertyBinding"),g="@custom",I="--";var h=J.extend("sap.ui.model.base.ManagedObjectModel",{constructor:function(o,D){if(!D&&typeof D!="object"){D={};}D[g]={};this._oObject=o;this._mObservedCount={properties:{},aggregations:{}};this.mListBinding={};J.apply(this,[D]);this._oObserver=new c(this.observerChanges.bind(this));}});h.prototype.getAggregation=J.prototype.getProperty;h.prototype.setData=function(D,m){var _={};_[g]=D;J.prototype.setData.apply(this,[_,m]);};h.prototype.getJSON=function(){return JSON.stringify(this.oData[g]);};h.prototype.setProperty=function(p,v,o,A){var r=this.resolve(p,o),l,O,P;if(!r){return false;}if(r.indexOf("/"+g)===0){return J.prototype.setProperty.apply(this,arguments);}l=r.lastIndexOf("/");O=r.substring(0,l||1);P=r.substr(l+1);var i=this._getObject(O);if(i){if(i instanceof M){var j=i.getMetadata().getProperty(P);if(j){var s=j._sMutator,G=j._sGetter;if(i[G]()!==v){i[s](v);this.checkUpdate(false,A);return true;}}}else if(i[P]!==v){i[P]=v;this.checkUpdate(false,A);return true;}}return false;};h.prototype.addBinding=function(B){J.prototype.addBinding.apply(this,arguments);if(B instanceof e){var A=B.sPath.replace("/","");this.mListBinding[A]=B;}B.checkUpdate(false);};h.prototype.removeBinding=function(B){J.prototype.removeBinding.apply(this,arguments);if(B instanceof e){var A=B.sPath.replace("/","");delete this.mListBinding[A];}this._observeBeforeEvaluating(B,false);};h.prototype.firePropertyChange=function(A){if(A.reason===d.Binding){A.resolvedPath=this.resolve(A.path,A.context);}J.prototype.firePropertyChange.call(this,A);};h.prototype.bindAggregation=function(p,o,P){return J.prototype.bindProperty.apply(this,arguments);};h.prototype.bindProperty=function(p,o,P){var B=new f(this,p,o,P);return B;};h.prototype.bindList=function(p,o,s,F,P){var B=new e(this,p,o,s,F,P);B.enableExtendedChangeDetection();return B;};h.prototype.getManagedObject=function(p,o){if(p instanceof C){o=p;p=o.getPath();}var O=this.getProperty(p,o);if(O instanceof M){return O;}return null;};h.prototype.getRootObject=function(){return this._oObject;};h.prototype._observePropertyChange=function(o,p){if(!o||!p){return;}var k=o.getId()+"/@"+p.name;if(!this._oObserver.isObserved(o,{properties:[p.name]})){this._oObserver.observe(o,{properties:[p.name]});this._mObservedCount.properties[k]=1;}else{this._mObservedCount.properties[k]++;}};h.prototype._unobservePropertyChange=function(o,p){if(!o||!p){return;}var k=o.getId()+"/@"+p.name;this._mObservedCount.properties[k]--;if(this._mObservedCount.properties[k]==0){this._oObserver.unobserve(o,{properties:[p.name]});delete this._mObservedCount.properties[k];}};h.prototype._observeAggregationChange=function(o,A){if(!o||!A){return;}var k=o.getId()+"/@"+A.name;if(!this._oObserver.isObserved(o,{aggregations:[A.name]})){this._oObserver.observe(o,{aggregations:[A.name]});this._mObservedCount.aggregations[k]=1;}else{this._mObservedCount.aggregations[k]++;}};h.prototype._unobserveAggregationChange=function(o,A){if(!o||!A){return;}var k=o.getId()+"/@"+A.name;this._mObservedCount.aggregations[k]--;if(this._mObservedCount.aggregations[k]==0){this._oObserver.unobserve(o,{aggregations:[A.name]});delete this._mObservedCount.aggregations[k];}};h.prototype._createId=function(i){var o=this._oObject;if(typeof o.createId==="function"){return o.createId(i);}if(!i){return o.getId()+I+q.sap.uid();}if(i.indexOf(o.getId()+I)!=0){return o.getId()+I+i;}return i;};h.prototype._getSpecialNode=function(n,s,p,P){if(n instanceof M){if(s==="className"){if(n.getMetadata){return n.getMetadata().getName();}else{return typeof n;}}else if(s==="id"){return n.getId();}else if(s==="metadataContexts"){return n._oProviderData;}}else if(s==="binding"&&p&&P){return p.getBinding(P);}else if(s==="bound"&&p&&P){return p.isBound(P);}else if(s==="bindingInfo"&&p&&P){return p.getBindingInfo(P);}else if(q.isArray(n)){if(s==="length"){return n.length;}else if(s.indexOf("id=")===0){var j=s.substring(3),F=null;for(var i=0;i<n.length;i++){if(n[i].getId()===this._createId(j)||n[i].getId()===j){F=n[i];break;}}return F;}}return null;};h.prototype._getObject=function(p,o){var n=this._oObject,r="",t=this;this.aBindings.forEach(function(B){if(!B._bAttached){t._observeBeforeEvaluating(B,true);}});if(typeof p==="string"&&p.indexOf("/")!=0&&!o){return null;}if(o instanceof M){n=o;r=p;}else if(!o||o instanceof C){r=this.resolve(p,o);if(!r){return n;}if(r.indexOf("/"+g)===0){return J.prototype._getObject.apply(this,[p,o]);}}else{n=o;r=p;}if(!n){return null;}var P=r.split("/"),i=0;if(!P[0]){i++;}var j=null,s=null,k;while(n!==null&&P[i]){k=P[i];if(k.indexOf("@")===0){n=this._getSpecialNode(n,k.substring(1),j,s);}else if(n instanceof M){var N=n.getMetadata();if(N.isInstanceOf("sap.ui.core.IDScope")&&k.indexOf("#")===0){n=n.byId(k.substring(1));}else{j=n;s=k;var l=N.getProperty(k);if(l){n=n[l._sGetter]();}else{var A=N.getAggregation(k)||N.getAllPrivateAggregations()[k];if(A){n=n[A._sGetter]?n[A._sGetter]():n.getAggregation(k);}else{if(n&&n[k]&&typeof n[k]==="function"){n=n[k]();}else{n=null;}}}}}else if(q.isArray(n)||q.isPlainObject(n)){n=n[k];}else{if(n&&n[k]&&typeof n[k]==="function"){n=n[k]();}else{n=null;}}i++;}return n;};h.prototype.destroy=function(){for(var n in this._mAggregationObjects){var o=this._mAggregationObjects[n];if(o.object.invalidate.fn){o.object.invalidate=o.object.invalidate.fn;}}J.prototype.destroy.apply(this,arguments);};h.prototype._observeBeforeEvaluating=function(B,o){if(!B.isResolved()){return;}var p=B.getPath();var i=B.getContext(),n=this._oObject,r;if(i instanceof M){n=i;r=p;}else if(!i||i instanceof C){r=this.resolve(p,i);if(!r){return;}if(r.indexOf("/"+g)===0){return;}}else{return;}var P=r.split("/");if(!P[0]){P.shift();}var s=P[0];if(n.getMetadata().isInstanceOf("sap.ui.core.IDScope")&&s.indexOf("#")===0){n=n.byId(s.substring(1));s=P[1];}if(n instanceof M){var N=n.getMetadata(),j=N.getProperty(s);if(j){if(o===true){this._observePropertyChange(n,j);}else if(o===false){this._unobservePropertyChange(n,j);}}else{var A=N.getAggregation(s)||N.getAllPrivateAggregations()[s];if(A){if(o===true){this._observeAggregationChange(n,A);}else if(o===false){this._unobserveAggregationChange(n,A);}}}B._bAttached=o;}};h.prototype.observerChanges=function(o){if(o.type=="aggregation"){if(o.mutation=="insert"){this._oObserver.observe(o.child,{properties:true,aggegations:true});}else{this._oObserver.unobserve(o.child,{properties:true,aggegations:true});}if(this.mListBinding[o.name]){var l=this._oObject.getBinding(o.name);var A=this._oObject.getAggregation(o.name);if(l&&l.getLength()!=A.length){return;}}}this.checkUpdate();};return h;});