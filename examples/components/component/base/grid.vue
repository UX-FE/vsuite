<template>
    <div class="other">
        
                <Row>
                    <Col span="24"><div>24</div></Col>
                </Row>
                <br/>
                <Row>
                    <Col span="12"><div>12</div></Col>
                    <Col span="12"><div>12</div></Col>
                </Row>
                <br/>
                <Row>
                    <Col span="8"><div>8</div></Col>
                    <Col span="8"><div>8</div></Col>
                    <Col span="8"><div>8</div></Col>
                </Row>
                <br/>
                <Row>
                    <Col span="6"><div>6</div></Col>
                    <Col span="6"><div>6</div></Col>
                    <Col span="6"><div>6</div></Col>
                    <Col span="6"><div>6</div></Col>
                </Row>
                <br/>
                <Row>
                    <Col span="10"><div>10</div></Col>
                    <Col span="14"><div>14</div></Col>
                </Row>
                
                <Row :gutter="16">
                    <Col span="6"><div>6</div></Col>
                    <Col span="6"><div>6</div></Col>
                    <Col span="6"><div>6</div></Col>
                    <Col span="6"><div>6</div></Col>
                </Row>
    </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  methods: {
  },
  mounted() {}
};

</script>
<style lang="sass" scoped>
.vsu-col{
    div{
        height:40px;
        background:#4B61D9;
        border-radius:4px;
        text-align:center;
        color:#fff;
        font-size:14px;
        line-height:40px;
    }
    &:nth-child(odd){
        div{
            background:#8494ee;
        }
    }
}
</style>
