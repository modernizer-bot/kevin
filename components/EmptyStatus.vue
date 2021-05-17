<template>
    <div class="EmptyStatus">
        <img :src="require(`~/assets/images/empty/${ imgSrc }.svg`)" >
        <span>{{ message }}</span>
    </div>
</template>

<script>
    export default {
        props: {
            message: String,
            type: {
                type: String,
                default: 'empty'
            }
        },

        data() {
            return {
                img: '404'
            }
        },

        computed: {
            imgSrc() {
                switch (this.type) {
                    case '404': 
                        return '404';
                    case '500':
                        return '500';
                    case 'search':
                        return 'search';
                    default:
                        return 'no-data';

                }
            }
        }
    }
</script>


<style lang="scss" scoped>
    .EmptyStatus {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        color: $--color-text-secondary;
        height: 300px;
        img {
            width: 200px;
            height: 170px;
        }
        span {
            font-size: $--font-size-base;
            margin: $--space-md 0;
            line-height: 1;
        }
    }
</style>