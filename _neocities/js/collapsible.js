let collapsible = document.getElementsByClassName("collapsible");
let contents = document.getElementsByClassName('collapsible-content');

for(let i = 0; i < collapsible.length; i++) {
	collapsible[i].addEventListener("click", function() {
		this.classList.toggle("collapsible-active");
		var content = contents[i];
		if (content.style.maxHeight){
			content.style.maxHeight = null;
		} else {
			content.style.maxHeight = content.scrollHeight + "px";
		}
	});
}