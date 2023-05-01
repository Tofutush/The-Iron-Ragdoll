function elt(type,props,...children){let dom=document.createElement(type);if(props)Object.assign(dom,props);for(let child of children){if(typeof child!="string")dom.appendChild(child);else dom.appendChild(document.createTextNode(child));}return(dom);}
function titleBox(targets) {
	let box = elt('div', {style: 'font-size:24px;border:10px solid #000;background-color:#fff;padding:5px;position:fixed;filter:opacity(0);transition:filter .1s;z-index:12345;'});
	for(let z = 0; z < targets.length; z++) {
		targets[z].addEventListener('mouseover', e => {
			box.innerText = targets[z].getAttribute('text');
			box.style.borderColor = targets[z].getAttribute('c');
			box.style.filter = 'opacity(1)';
		});
		targets[z].addEventListener('mouseout', e => {
			box.style.filter = 'opacity(0)';
		});
	};
	window.addEventListener('mousemove', e => {
		box.style.top = (e.clientY + 20) + 'px';
		box.style.left = (e.clientX + 20) + 'px';
	});
	return box;
}