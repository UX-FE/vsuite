export default {
    name: 'TableExpand',
    functional: true,
    props: {
        row: Object,
        render: Function,
        index: Number,
        expandedIndexs:Array,
        column: {
            type: Object,
            default: null
        }
    },
    render: (h, ctx) => {//h为createElement,ctx为context
        //调用传入的数据时调用ctx.props.row
        const params = {
            row: ctx.props.row,
            index: ctx.props.index,
            expandedIndexs: ctx.props.expandedIndexs
        };
        if (ctx.props.column) params.column = ctx.props.column;
        
        return ctx.props.render(h, params);
    }
};