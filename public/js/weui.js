;(function(doc,undefined){
	
	//扩展weui对象
	window.weui = {
		confirm : function(text,title,call){
			//参数是一个对象时候，解析
			if(arguments.length == 1 && arguments[0] instanceof Object){
				//重置为true，以免被形参影响显示类型
				arguments[0].isConfirm = true;
				getDialog(arguments[0]);
			//参数也可以是多个
			}else{
				var option = {
					isConfirm : true,
					text :text
				}
				if(title && title instanceof Function){
					option.primary_button = {
						text : "确认",
						call : title
					}
				}else if(call && call instanceof Function){
					option.title = title;
					option.primary_button = {
						text : "确认",
						call : title
					}
					
				}
				getDialog(option);
			}
			
		},
		alert : function(text,title,call){
			var option = {
				isConfirm : false,
				title : title,
				text :text,
				primary_button : {
					text : '确认',
					call : call
				}
			}
		}
	}
	
	//简化对象调用
	var weui = window.weui;
	
	//对象覆盖函数
	weui.extend = function(default_option,custom){
		for (var name in custom){
			copy=custom[name];
			//防止循环调用
			if(default_option === copy) continue;
			//防止附加未定义值
			if(typeof copy === 'undefined') continue;
			//赋值
			default_option[name]=copy;
		}
		return default_option;
	}
	
	/**
	 * 得到一个自定义标签
	 * 
	 * tag 为标签类型，不指定为div
	 * 
	 * attrs 为一个json对象，指明标签需要的属性
	 * 
	 * html 指定标签的内容
	 * 
	 * 范例： getCustomElement({tag:'a',attrs:{class:'class',id:'id'},html:'我是文本'});
	 */
	weui.getCustomElement = function(option){
		var default_option = {
			tag : 'div'
		}
		var setting = weui.extend(default_option,option);
		var tag = document.createElement(setting.tag);
		if(setting.attrs){
			for(var attr in setting.attrs){
				tag.setAttribute(attr,setting.attrs[attr]);
			}
		}
		if(setting.html){
			tag.innerHTML = setting.html;
		}
		return tag;
	}
	
	

	/**
	 * 
	 * getDialog({isConfirm:true,title:'标题',text:'文本',secondary_button:{text:'次要按钮',color:'#f36',call:function(){}},primary_button:{text:'主要按钮',color:'#36f',call:function(){}}})
	 * 
	 * @param {Object} option
	 */
	function getDialog(option){
		var default_option = {
			isConfirm : false,
			title : '提示',
			text : '',
			secondary_button : {
				text : '取消'
			},
			primary_button : {
				text : '确认'
			}
		}
		var setting = weui.extend(default_option,option);
		var dialog_outter = weui.getCustomElement({attrs:{id:'weui_dialog'}});
	
		var weui_mask = weui.getCustomElement({attrs:{class:'weui-mask'}});
		dialog_outter.appendChild(weui_mask);
		
		var dialog_inner = weui.getCustomElement({attrs:{class:'weui-dialog'}});
		
		//标题部分
		var weui_dialog_hd = weui.getCustomElement({attrs:{class:'weui-dialog__hd'}});
		
		var weui_dialog_title = weui.getCustomElement({tag:'strong',attrs:{class:'weui-dialog__title'},html:setting.title});
		
		weui_dialog_hd.appendChild(weui_dialog_title);
		
		//文本部分
		var weui_dialog_bd = weui.getCustomElement({attrs:{class:'weui-dialog__bd'},html:setting.text});
		
		//操作按钮
		var weui_dialog_ft = weui.getCustomElement({attrs:{class:'weui-dialog__ft'}});
		if(setting.isConfirm){
			var button_left = weui.getCustomElement({tag:'a',attrs:{class:'weui-dialog__btn weui-dialog__btn_default'},html:setting.secondary_button.text});
			if(setting.secondary_button.color){
				button_left.style.color = setting.secondary_button.color;
			}
			weui_dialog_ft.appendChild(button_left);
			//移除是必然的，不管有没有绑定回调函数
			button_left.addEventListener('click',function(){
				document.getElementById('weui_dialog').remove();
			});
			//绑定回调函数
			if(setting.secondary_button.call){
				button_left.addEventListener('click',setting.secondary_button.call);
			}
		}
		
		var button_right = weui.getCustomElement({tag:'a',attrs:{class:'weui-dialog__btn weui-dialog__btn_primary'},html:setting.primary_button.text});
		if(setting.primary_button.color){
			button_right.style.color = setting.primary_button.color;
		}
		weui_dialog_ft.appendChild(button_right);
		
		//移除是必然的，不管有没有绑定回调函数
		button_right.addEventListener('click',function(){
			document.getElementById('weui_dialog').remove();
		});
		//绑定回调函数
		if(setting.primary_button.call){
			button_right.addEventListener('click',setting.primary_button.call);
		}
		

		
		
		dialog_inner.appendChild(weui_dialog_hd);
		dialog_inner.appendChild(weui_dialog_bd);
		dialog_inner.appendChild(weui_dialog_ft);
		
		dialog_outter.appendChild(dialog_inner);
		
		doc.documentElement.appendChild(dialog_outter);
	}
	

})(document);