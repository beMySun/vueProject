<template>
	<router-view>

	</router-view>
</template>
<script>
var Ohtml = document.documentElement;
getSize();
function getSize(){
    var screenWidth = Ohtml.clientWidth;
    if(screenWidth < 325){
        Ohtml.style.fontSize = '35px';
    }else if(screenWidth > 640){
        Ohtml.style.fontSize = '68.30px';
    }else{
        Ohtml.style.fontSize = screenWidth/9.37 +'px';
    }
}

</script>
<style lang="less">
@import 'styles/index.less';
.header{
	line-height:35px;
	border-bottom:1px solid #ccc;
	text-align:center;
	background:#fff;
}
</style>