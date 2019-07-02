<template>
    <div :class="classes">
         <!-- loading start -->
        <template v-if="chartdata.status==='loading'">
            <v-loading></v-loading>
        </template>
        <!-- loading end -->
        <!-- chart start -->
        <template v-else-if="chartdata.status==='hasData'">
            <slot>
                <div :id="chartdata.id"></div>
            </slot>
        </template>
        <!-- chart end -->
        <!-- nodate start -->
        <template v-else>
            <v-nodata :nodata="chartdata.noDataTxt?chartdata.noDataTxt:'暂无数据'" :class="chartdata.noDataClass"></v-nodata>
        </template>
    </div>
</template>
<script>
    import { prefix } from '../var';
    const chartPrefix = prefix+'chart';

    export default {
        name: 'Chart',
        props: {
            type: String
        },
        computed: {
            classes () {
                return [
                    `${chartPrefix}`
                ];
            }
        }
    };
</script>
