<template>
    <div class="complete">
        <div class="wrap">
            <div class="state"><i class="success"></i></div>
            <div class="mes">{{mes}}</div>
        </div>
    </div>
</template>
<script>
import {XButton, Cell, Group} from '../components'

export default{
    components: {
        Cell,
        Group,
        XButton
    },
    data () {
        return {
            mes: '投保成功'
        }
    },
    ready: function () {
        document.getElementsByTagName('title')[0].innerHTML = '完成';
    }
}
</script>
<style lang="less">
.complete{
    .wrap{
        margin-top: 4rem;
    }
    .state{
        width: 2.5rem;
        height: 2.5rem;
        margin: 0 auto;
        border: 1px solid #4285F7;
        border-radius: 50%;
        margin: 0 auto;
        background: #E4EEFF;
        position: relative;
    }
    i.success{
        width: 1.5rem;
        height: 1rem;
        display: inline-block;
        border-bottom: 3px solid #4285F7;
        border-left: 3px solid #4285F7;
        transform: translate(-50%,-75%)rotateZ(-45deg);
        border-radius: 3px;
        position: absolute;
        top: 50%;
        left: 50%;
    }
    .mes{
        color:#4285F7;
        text-align: center;
        margin-top: 1rem;
        font-size: 0.5rem;
    }
}
</style>