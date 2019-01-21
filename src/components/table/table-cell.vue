<template>
    <div ref="cell">       
        <Cell           
            :row="row"
            :column="column"
            :index="index"
            :render="column.render">
        </Cell>
    </div>
</template>
<script>
    import Cell from './expand';
    export default {
        name: 'TableCell',
        components: { Cell },
        props: {
            prefixCls: String,
            row: Object,
            column: Object,       
            index: Number            
        },
        data () {
            return {
                 context: this.$parent.currentContext
            };
        },
        methods: {
          
        }
    };
</script>