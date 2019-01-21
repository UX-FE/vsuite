<template>
    <div>
        
                <Badge count="5">
                    <BaseButton>消息</BaseButton>
                </Badge>
                <Badge count="35">
                    <BaseButton>消息</BaseButton>
                </Badge>
                <Badge count="5">
                    <span class="text-badge">消息</span>
                </Badge>
    </div>
</template>

<script>
export default {
  methods: {
  },
  mounted() {}
};
</script>
<style lang="sass">
    .vsu-badge{
        margin-right:40px;
    }
    .square-badge{
        width:36px;
        height:36px;
        background:#ccc;
        border-radius:4px;
    }
    .text-badge{
        display:inline-block;
        padding-right:5px;
    }
</style>
