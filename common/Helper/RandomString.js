/*
* 随机密码
* @Author: Chandre
* @Date:   2020-05-28 04:03:55
 * @Last Modified by: chandre
 * @Last Modified time: 2021-04-20 18:23:07
*/

/**
 * 创建object随机对象
 */
 const randomFunc = {
    lower: getRandomLower,
    upper: getRandomupper,
    number: getRandomNumber,
    symbol: getRandomSymbol
}

/**
 * 随机小写
 */
function getRandomLower() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 97)
}
/**
 * 随机大写
 */
function getRandomupper() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 65)
}
/**
 * 随机数字
 */
function getRandomNumber() {
  return String.fromCharCode(Math.floor(Math.random() * 10) + 48)
}
/**
 * 随机符号
 */
function getRandomSymbol() {
  const symbols = '!@#$%^&*(){}[]=<>/,.'
  return symbols[Math.floor(Math.random() * symbols.length)]
}
/**
 *
 * @param {*} length
 * @param {*} lower
 * @param {*} upper
 * @param {*} number
 * @param {*} symbol
 */
export default function generatedPassword(length=8, lower=true, upper=true, number=true, symbol=false) {
    /**
     * 1.初始化密码
     * 2.过滤出没有选中的密码类型
     * 3.通过循环获得每个密码的变量
     * 4.奖处理后的随机密码结果进行保存再返回值
     */
    let generatedPassword = ''
    const typesCount = lower + upper + number + symbol
    const typeArr = [{ lower }, { upper }, { number }, { symbol }].filter(
        item => Object.values(item)[0]
    )
    /**
     * 如果全部没选
     */
    if (typesCount === 0) {
        return ''
    }
    // console.log(typeArr)
    /**
     * 循环需要生成的密码长度length
     */
    for (let i = 0; i < length; i += typesCount) {
        typeArr.forEach(type => {
        /**
         * 每次循环出选中的type
         */
        const funcName = Object.keys(type)[0]
        // console.log(funcName)
        /**
         * 将结果用randomFunc()去比对键值
         * 然后执行方法
         */
        generatedPassword += randomFunc[funcName]()
        })
    }
    const finalPassword = generatedPassword.slice(0, length)
    return finalPassword
    // console.log(generatedPassword)
}