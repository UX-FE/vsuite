<template>
    <div>
                <TimeLine>
                    <TimeLineItem v-for="(item,i) in timeline1" :key="i">
                        <div>{{item}}</div>
                    </TimeLineItem>
                </TimeLine>
                <br/>
                <TimeLine>
                    <TimeLineItem v-for="(item,i) in timeline1" :key="i" :active="i===0">
                        <div>{{item}}</div>
                    </TimeLineItem>
                </TimeLine>

    </div>
</template>

<script>
    export default {
        data() {
            return {
        timeline1:[
            '发布1.0版本',
            '发布2.0版本',
            '发布3.0版本',
            '发布4.0版本'
        ],
            }
        },
    }
</script>

<style lang="sass">
.demo-year-left{
    .vsu-timeline{
        .vsu-timeline-item{
            padding: 0 0 12px 46px;
            .vsu-timeline-item-line{
                left: 50px;
            }
            .vsu-timeline-item-content{
                .time{
                    .year{
                        position: absolute;
                        left: -38px;
                    }
                    .day{

                    }
                }
                .download-wrap{
                    margin-bottom:16px;
                    .version{
                        font-size: 14px;
                        color: #1864FF;
                        text-align: left;
                        line-height: 22px;
                        margin-right: 16px;
                        display: inline-block;
                    }
                    .download{
                        width: 44px;
                        height: 22px;
                        display: inline-block;
                        font-size:12px;
                        text-align: center;
                        line-height: 22px;
                        cursor: pointer;
                        background: #1864FF;
                        border-radius: 4px;
                        color: #fff;
                        vertical-align: top;
                    }
                }
                .content{
                   padding:20px 24px;
                    p{
                        margin-bottom:16px;
                    }
                }
            }
        }
    }
}
.custom{
    padding-left: 20px;
    .content{
        padding: 0 5px 10px 20px;
    }
}
</style>
