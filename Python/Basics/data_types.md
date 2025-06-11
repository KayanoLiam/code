# 基本数据类型

深入探索 Python 的**基本数据类型**，理解数据在计算机中的表示方式。

**从一个简单问题开始**

你有没有想过，当你在 Python 中写下 `42` 的时候，计算机是如何理解和存储这个数字的？当你写 `"Hello"` 的时候，这些字符又是如何在内存中排列的？

让我们从最基础的概念开始，一步步揭开 Python 数据类型的神秘面纱。

**数据类型：计算机理解世界的方式**

在现实世界中，我们有各种各样的"东西"：数字、文字、真假判断、空无一物。计算机需要用不同的方式来表示和处理这些"东西"，这就是**数据类型**的概念。

Python 提供了几种基本的数据类型，每一种都有其独特的特性和用途。让我们从最直观的数字开始。

## 整数：无限大的可能

**第一印象：整数很简单？**

你可能觉得整数是最简单的数据类型，不就是 1、2、3 这样的数字吗？让我们先试试：

```python
# 看起来很普通的整数
age = 25
year = 2024
temperature = -10

print(f"年龄：{age}")
print(f"年份：{year}")
print(f"温度：{temperature}°C")
```

确实很简单。但是，Python 的整数有一个让人惊讶的特性。让我们做个实验：

```python
# 试试一个很大的数字
big_number = 123456789012345678901234567890
print(f"大数字：{big_number}")
print(f"类型：{type(big_number)}")

# 再试试更大的
even_bigger = big_number ** 10
print(f"更大的数字：{even_bigger}")
```

运行这段代码，你会发现 Python 毫不费力地处理了这些巨大的数字！这在很多其他编程语言中是不可能的。

**Python 整数的"超能力"**

在 C 语言中，`int` 类型通常只能表示 -2,147,483,648 到 2,147,483,647 之间的数字。超出这个范围就会溢出。但 Python 的整数没有这个限制！

```python
# 让我们验证一下 Python 整数的"无限"特性
import sys

# 在其他语言中可能溢出的数字
c_int_max = 2147483647
beyond_c_limit = c_int_max + 1

print(f"C语言int最大值：{c_int_max}")
print(f"超出C语言限制：{beyond_c_limit}")
print(f"类型仍然是：{type(beyond_c_limit)}")

# 计算一个天文数字：2的1000次方
astronomical = 2 ** 1000
print(f"2的1000次方有 {len(str(astronomical))} 位数字")
print(f"前50位：{str(astronomical)[:50]}...")
```

这是怎么做到的？Python 在底层使用了**任意精度算术**，当数字超出机器字长时，会自动切换到更复杂但更灵活的表示方式。

**进制：数字的不同"语言"**

在日常生活中，我们习惯用十进制（0-9）来表示数字。但计算机内部使用二进制（0-1），程序员有时也会用十六进制（0-F）。Python 支持多种进制：

```python
# 同一个数字的不同表示方式
decimal = 42        # 十进制：我们日常使用的
binary = 0b101010   # 二进制：计算机内部使用的
octal = 0o52        # 八进制：较少使用
hexadecimal = 0x2A  # 十六进制：程序员常用

print("同一个数字的不同表示：")
print(f"十进制：{decimal}")
print(f"二进制：{binary}")
print(f"八进制：{octal}")
print(f"十六进制：{hexadecimal}")

# 验证它们确实相等
print(f"它们都相等吗？{decimal == binary == octal == hexadecimal}")
```

**为什么要了解不同进制？**

- **二进制**：理解计算机如何存储数据
- **十六进制**：在处理颜色、内存地址时很有用
- **八进制**：在 Unix 文件权限中使用

让我们看一个实际例子：

```python
# 颜色值通常用十六进制表示
red = 0xFF0000    # 红色：红=255, 绿=0, 蓝=0
green = 0x00FF00  # 绿色：红=0, 绿=255, 蓝=0
blue = 0x0000FF   # 蓝色：红=0, 绿=0, 蓝=255

print(f"红色值：{red} (十进制)")
print(f"绿色值：{green} (十进制)")
print(f"蓝色值：{blue} (十进制)")

# 文件权限（Unix系统）
read_write_execute = 0o755  # 所有者：读写执行，其他：读执行
print(f"文件权限 755：{read_write_execute} (十进制)")
```

**进制转换：数字的"翻译"**

Python 提供了方便的函数来在不同进制间转换：

```python
number = 42

print(f"十进制 {number} 的其他表示：")
print(f"  二进制：{bin(number)}")      # 0b101010
print(f"  八进制：{oct(number)}")      # 0o52
print(f"  十六进制：{hex(number)}")    # 0x2a

# 反向转换：从字符串转换为整数
binary_str = "101010"
decimal_from_binary = int(binary_str, 2)  # 第二个参数指定进制
print(f"二进制 '{binary_str}' 转为十进制：{decimal_from_binary}")

hex_str = "2A"
decimal_from_hex = int(hex_str, 16)
print(f"十六进制 '{hex_str}' 转为十进制：{decimal_from_hex}")
```

**大数字的可读性：下划线分隔符**

当数字很大时，阅读起来很困难。Python 3.6+ 引入了下划线分隔符来提高可读性：

```python
# 难以阅读的大数字
hard_to_read = 1000000000

# 使用下划线分隔，更容易阅读
easy_to_read = 1_000_000_000
light_speed = 299_792_458  # 光速：299,792,458 米/秒
phone_number = 138_0013_8000

print(f"十亿：{easy_to_read}")
print(f"光速：{light_speed} 米/秒")
print(f"电话号码：{phone_number}")

# 下划线只是为了可读性，不影响数值
print(f"相等吗？{hard_to_read == easy_to_read}")  # True

# 下划线可以放在任何位置（但要合理）
weird_but_valid = 1_2_3_4_5
print(f"奇怪但有效：{weird_but_valid}")  # 12345
```

## 浮点数：小数的复杂世界

**从简单的小数开始**

整数很直观，但现实世界中我们经常需要处理小数：温度、价格、距离等。让我们看看 Python 如何处理这些：

```python
# 日常生活中的小数
temperature = 36.5
price = 19.99
height = 1.75

print(f"体温：{temperature}°C")
print(f"价格：${price}")
print(f"身高：{height}米")
```

看起来很简单，对吧？但是浮点数（小数）比整数复杂得多。让我们做一个令人惊讶的实验：

```python
# 一个"简单"的计算
result = 0.1 + 0.2
print(f"0.1 + 0.2 = {result}")
print(f"结果等于 0.3 吗？{result == 0.3}")

# 让我们看看更精确的表示
print(f"精确值：{result:.20f}")
print(f"0.3 的精确值：{0.3:.20f}")
```

什么？！0.1 + 0.2 不等于 0.3？这不是 Python 的 bug，而是**浮点数表示的固有限制**。

**浮点数的"秘密"：二进制表示**

问题的根源在于：计算机使用二进制来存储数字，而很多十进制小数无法精确地用二进制表示。

就像 1/3 在十进制中是 0.333... 无限循环一样，0.1 在二进制中也是无限循环的！

```python
# 让我们探索这个现象
from fractions import Fraction

# 看看 0.1 的真实表示
decimal_point_one = 0.1
fraction_representation = Fraction(decimal_point_one).limit_denominator()

print(f"0.1 在计算机中实际存储为：{Fraction(decimal_point_one)}")
print(f"近似分数：{fraction_representation}")

# 这解释了为什么会有精度问题
print(f"0.1 的真实值：{decimal_point_one:.25f}")
```

**科学计数法：处理极大和极小的数**

在科学计算中，我们经常遇到非常大或非常小的数字。Python 支持科学计数法：

```python
# 极大的数字
speed_of_light = 3e8        # 3 × 10^8 = 300,000,000
avogadro_number = 6.022e23  # 阿伏伽德罗常数

# 极小的数字
planck_constant = 6.626e-34 # 普朗克常数
electron_mass = 9.109e-31   # 电子质量（千克）

print(f"光速：{speed_of_light} 米/秒")
print(f"阿伏伽德罗常数：{avogadro_number}")
print(f"普朗克常数：{planck_constant}")
print(f"电子质量：{electron_mass} 千克")

# 科学计数法的计算
distance_to_star = 4.37 * speed_of_light * 365 * 24 * 3600  # 光年
print(f"最近恒星距离：{distance_to_star:.2e} 米")
```

**特殊的浮点值：无穷大和非数字**

浮点数标准定义了一些特殊值：

```python
# 特殊浮点值
positive_infinity = float('inf')
negative_infinity = float('-inf')
not_a_number = float('nan')

print(f"正无穷：{positive_infinity}")
print(f"负无穷：{negative_infinity}")
print(f"非数字：{not_a_number}")

# 这些值的产生
print(f"1.0 / 0.0 会产生：", end="")
try:
    result = 1.0 / 0.0
    print(result)
except ZeroDivisionError:
    print("ZeroDivisionError（在某些情况下）")

# 但这样不会报错
result = float('inf') / float('inf')
print(f"无穷大除以无穷大：{result}")  # nan

# 检查特殊值
import math
values = [3.14, float('inf'), float('-inf'), float('nan')]
for value in values:
    print(f"{value}:")
    print(f"  是有限数吗？{math.isfinite(value)}")
    print(f"  是无穷大吗？{math.isinf(value)}")
    print(f"  是NaN吗？{math.isnan(value)}")
```

**解决精度问题：decimal 模块**

当精度很重要时（比如金融计算），我们需要更精确的解决方案：

```python
from decimal import Decimal, getcontext

# 设置精度
getcontext().prec = 50

# 使用 Decimal 进行精确计算
a = Decimal('0.1')
b = Decimal('0.2')
result = a + b

print(f"使用 Decimal：")
print(f"0.1 + 0.2 = {result}")
print(f"结果等于 0.3 吗？{result == Decimal('0.3')}")

# 金融计算示例
price = Decimal('19.99')
tax_rate = Decimal('0.08')  # 8% 税率
tax = price * tax_rate
total = price + tax

print(f"\n金融计算：")
print(f"商品价格：${price}")
print(f"税率：{tax_rate * 100}%")
print(f"税额：${tax:.2f}")
print(f"总价：${total:.2f}")

# 对比浮点数计算
float_price = 19.99
float_tax_rate = 0.08
float_total = float_price * (1 + float_tax_rate)
print(f"浮点数计算总价：${float_total}")
print(f"差异：${abs(float(total) - float_total)}")
```

**四舍五入：看似简单的复杂问题**

四舍五入看起来简单，但实际上有很多细节：

```python
import math

# 基本四舍五入
pi = 3.14159265359
print(f"π = {pi}")
print(f"保留2位小数：{round(pi, 2)}")
print(f"保留4位小数：{round(pi, 4)}")

# 四舍五入的"陷阱"
print(f"\n四舍五入的特殊情况：")
print(f"round(2.5) = {round(2.5)}")  # 2，不是3！
print(f"round(3.5) = {round(3.5)}")  # 4
print(f"round(4.5) = {round(4.5)}")  # 4，不是5！

# 这是"银行家舍入"：遇到.5时，舍入到最近的偶数
print(f"\n银行家舍入规则：")
test_values = [0.5, 1.5, 2.5, 3.5, 4.5, 5.5]
for value in test_values:
    print(f"round({value}) = {round(value)}")

# 其他舍入方式
print(f"\n其他舍入方式：")
value = 3.7
print(f"向上取整：{math.ceil(value)}")   # 4
print(f"向下取整：{math.floor(value)}")  # 3
print(f"截断：{math.trunc(value)}")      # 3

value = -3.7
print(f"负数向上取整：{math.ceil(value)}")   # -3
print(f"负数向下取整：{math.floor(value)}")  # -4
print(f"负数截断：{math.trunc(value)}")      # -3
```

## 复数：虚数的真实力量

**复数：不只是数学课本上的概念**

你可能在数学课上学过复数，觉得它们只是理论概念。但在工程和科学计算中，复数无处不在：信号处理、量子力学、电路分析等。

Python 是少数几种原生支持复数的编程语言之一：

```python
# 创建复数：实部 + 虚部j
z1 = 3 + 4j  # 注意：Python 使用 j 而不是数学中的 i
z2 = complex(1, 2)  # 另一种创建方式
z3 = 5j      # 纯虚数
z4 = 7       # 纯实数（也是复数）

print(f"z1 = {z1}")
print(f"z2 = {z2}")
print(f"z3 = {z3}")
print(f"z4 = {z4}")

# 验证类型
print(f"z1 的类型：{type(z1)}")
print(f"z4 的类型：{type(z4)}")  # 整数，不是复数
```

**为什么用 j 而不是 i？**

在数学中，虚数单位通常写作 i，但在工程（特别是电气工程）中，i 通常表示电流，所以用 j 表示虚数单位。Python 采用了工程惯例。

**复数的基本操作**

```python
z1 = 3 + 4j
z2 = 1 + 2j

# 基本运算
print(f"z1 + z2 = {z1 + z2}")
print(f"z1 - z2 = {z1 - z2}")
print(f"z1 * z2 = {z1 * z2}")
print(f"z1 / z2 = {z1 / z2}")

# 获取实部和虚部
print(f"\nz1 = {z1}")
print(f"实部：{z1.real}")
print(f"虚部：{z1.imag}")

# 共轭复数（虚部变号）
print(f"z1 的共轭：{z1.conjugate()}")

# 模长（到原点的距离）
magnitude = abs(z1)
print(f"z1 的模长：{magnitude}")

# 手动计算模长验证
import math
manual_magnitude = math.sqrt(z1.real**2 + z1.imag**2)
print(f"手动计算的模长：{manual_magnitude}")
```

**复数的几何意义**

复数可以看作二维平面上的点，这给了我们强大的几何直觉：

```python
import cmath
import math

z = 3 + 4j

# 极坐标表示：r∠θ
polar = cmath.polar(z)
r, theta = polar
print(f"复数 {z} 的极坐标表示：")
print(f"模长 r = {r}")
print(f"角度 θ = {theta} 弧度 = {math.degrees(theta):.1f}°")

# 从极坐标创建复数
z_from_polar = cmath.rect(r, theta)
print(f"从极坐标重建：{z_from_polar}")

# 欧拉公式：e^(iθ) = cos(θ) + i*sin(θ)
theta = math.pi / 4  # 45度
euler_form = cmath.exp(1j * theta)
trig_form = complex(math.cos(theta), math.sin(theta))
print(f"\n欧拉公式验证（θ = 45°）：")
print(f"e^(iθ) = {euler_form}")
print(f"cos(θ) + i*sin(θ) = {trig_form}")
print(f"相等吗？{abs(euler_form - trig_form) < 1e-10}")
```

**实际应用：信号处理**

让我们看一个实际例子，用复数表示正弦波：

```python
import math

# 表示一个正弦信号：A*sin(ωt + φ)
# 可以用复数 A*e^(i(ωt + φ)) 表示

def generate_signal(amplitude, frequency, phase, time_points):
    """生成复数表示的信号"""
    signals = []
    for t in time_points:
        # 复数表示：A * e^(i(ωt + φ))
        omega = 2 * math.pi * frequency
        complex_signal = amplitude * cmath.exp(1j * (omega * t + phase))
        signals.append(complex_signal)
    return signals

# 生成信号
time_points = [t * 0.1 for t in range(10)]  # 0, 0.1, 0.2, ..., 0.9
amplitude = 2
frequency = 1  # 1 Hz
phase = math.pi / 4  # 45度相位

signals = generate_signal(amplitude, frequency, phase, time_points)

print("时间\t实部\t虚部\t模长")
for i, (t, signal) in enumerate(zip(time_points, signals)):
    print(f"{t:.1f}\t{signal.real:.2f}\t{signal.imag:.2f}\t{abs(signal):.2f}")
```

## 数学运算：Python 的计算能力

**基本算术：不只是加减乘除**

让我们从基本运算开始，但要理解每个运算符的细节：

```python
a, b = 10, 3

print("基本运算：")
print(f"{a} + {b} = {a + b}")    # 加法
print(f"{a} - {b} = {a - b}")    # 减法
print(f"{a} * {b} = {a * b}")    # 乘法
print(f"{a} / {b} = {a / b}")    # 除法（总是返回浮点数）
print(f"{a} // {b} = {a // b}")  # 整除（向下取整）
print(f"{a} % {b} = {a % b}")    # 取余
print(f"{a} ** {b} = {a ** b}")  # 幂运算
```

**除法的细节：/ vs //**

这是一个重要的区别，特别是在 Python 3 中：

```python
# Python 3 中的除法行为
print("除法运算的区别：")
print(f"10 / 3 = {10 / 3}")      # 3.3333... (浮点除法)
print(f"10 // 3 = {10 // 3}")    # 3 (整除)
print(f"10 / 4 = {10 / 4}")      # 2.5 (浮点除法)
print(f"10 // 4 = {10 // 4}")    # 2 (整除)

# 负数的整除行为
print(f"\n负数的整除：")
print(f"-10 // 3 = {-10 // 3}")   # -4，不是 -3！
print(f"-10 / 3 = {-10 / 3}")     # -3.3333...

# 为什么是 -4？因为整除是"向下取整"
import math
print(f"math.floor(-10/3) = {math.floor(-10/3)}")
```

**取余运算的妙用**

取余运算不只是求余数，它有很多实际用途：

```python
# 判断奇偶数
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
for num in numbers:
    if num % 2 == 0:
        print(f"{num} 是偶数")
    else:
        print(f"{num} 是奇数")

# 循环索引（很有用！）
items = ["A", "B", "C", "D"]
for i in range(10):
    # 使用取余实现循环访问
    item = items[i % len(items)]
    print(f"第{i}次：{item}")

# 时间计算
total_seconds = 3661  # 1小时1分1秒
hours = total_seconds // 3600
minutes = (total_seconds % 3600) // 60
seconds = total_seconds % 60
print(f"{total_seconds}秒 = {hours}小时{minutes}分{seconds}秒")
```

**复合赋值运算符：简洁的更新**

```python
# 复合赋值运算符让代码更简洁
x = 10
print(f"初始值：x = {x}")

x += 5   # 等价于 x = x + 5
print(f"x += 5 后：x = {x}")

x *= 2   # 等价于 x = x * 2
print(f"x *= 2 后：x = {x}")

x //= 3  # 等价于 x = x // 3
print(f"x //= 3 后：x = {x}")

x **= 2  # 等价于 x = x ** 2
print(f"x **= 2 后：x = {x}")

# 对于列表等可变对象，+= 和 = + 有区别
list1 = [1, 2, 3]
list2 = list1
list1 += [4, 5]  # 修改原列表
print(f"list1: {list1}")
print(f"list2: {list2}")  # list2 也变了

list3 = [1, 2, 3]
list4 = list3
list3 = list3 + [4, 5]  # 创建新列表
print(f"list3: {list3}")
print(f"list4: {list4}")  # list4 没变
```

**比较运算：不只是大小**

```python
# 基本比较
print(f"10 > 3: {10 > 3}")
print(f"10 == 10: {10 == 10}")
print(f"10 != 3: {10 != 3}")
print(f"5 <= 10: {5 <= 10}")

# Python 的链式比较（很优雅！）
age = 25
print(f"18 <= age <= 65: {18 <= age <= 65}")

# 等价于：
print(f"等价写法：{18 <= age and age <= 65}")

# 更复杂的链式比较
a, b, c = 1, 2, 3
print(f"a < b < c: {a < b < c}")
print(f"a < b > c: {a < b > c}")  # False，因为 b > c 是 False

# 字符串比较（字典序）
print(f"'apple' < 'banana': {'apple' < 'banana'}")
print(f"'Apple' < 'apple': {'Apple' < 'apple'}")  # 大写字母的 ASCII 值更小

# 比较不同类型（Python 3 中通常会报错）
try:
    result = 5 < "hello"
    print(f"5 < 'hello': {result}")
except TypeError as e:
    print(f"类型错误：{e}")
```

## 布尔值：真假的哲学

**二元世界：True 和 False**

在计算机的世界里，很多事情都可以简化为"是"或"否"、"真"或"假"。这就是布尔值的概念，以数学家乔治·布尔的名字命名。

```python
# 布尔值只有两个值
is_student = True
is_working = False
has_license = True

print(f"是学生吗？{is_student}")
print(f"在工作吗？{is_working}")
print(f"有驾照吗？{has_license}")

# 注意大小写！Python 区分大小写
# true = True   # 这会报错，因为 true 不是关键字
# false = False # 这也会报错
```

**布尔运算：逻辑的力量**

布尔值的真正力量在于逻辑运算。Python 提供了三个基本的逻辑运算符：

```python
is_student = True
is_working = False
has_license = True

# and：所有条件都为真时才为真
print(f"既是学生又在工作：{is_student and is_working}")  # False
print(f"是学生且有驾照：{is_student and has_license}")   # True

# or：至少一个条件为真时就为真
print(f"是学生或在工作：{is_student or is_working}")    # True
print(f"在工作或有驾照：{is_working or has_license}")   # True

# not：取反
print(f"不是学生：{not is_student}")                   # False
print(f"没有工作：{not is_working}")                   # True

# 复杂的逻辑表达式
can_drive = has_license and not is_working  # 有驾照且不在工作
print(f"可以开车出行：{can_drive}")
```

**比较运算：产生布尔值的源泉**

大多数布尔值来自比较运算：

```python
age = 20
score = 85
name = "Alice"

# 数值比较
print(f"成年了吗？{age >= 18}")  # True
print(f"还是未成年？{age < 18}")  # False
print(f"正好18岁？{age == 18}")   # False

# 成绩评估
print(f"及格了吗？{score >= 60}")     # True
print(f"优秀吗？{score >= 90}")       # False
print(f"良好吗？{80 <= score < 90}")  # True

# 字符串比较（字典序）
print(f"Alice 在字典中排在 Bob 前面：{'Alice' < 'Bob'}")  # True

# 身份比较 vs 值比较
a = [1, 2, 3]
b = [1, 2, 3]
c = a

print(f"a == b: {a == b}")  # True（值相等）
print(f"a is b: {a is b}")  # False（不是同一个对象）
print(f"a is c: {a is c}")  # True（是同一个对象）
```

**布尔值的数值本质**

有趣的是，Python 中的布尔值实际上是整数的子类：

```python
# 布尔值可以当作数字使用
print(f"True 的数值：{int(True)}")   # 1
print(f"False 的数值：{int(False)}")  # 0

# 这意味着可以进行数学运算
print(f"True + True = {True + True}")    # 2
print(f"True * 5 = {True * 5}")          # 5
print(f"False * 100 = {False * 100}")    # 0

# 实际应用：计算满足条件的数量
scores = [85, 92, 78, 96, 73, 88]
high_scores_count = sum(score >= 90 for score in scores)
print(f"高分（>=90）的数量：{high_scores_count}")

# 计算通过率
passed_count = sum(score >= 60 for score in scores)
pass_rate = passed_count / len(scores)
print(f"通过率：{pass_rate:.1%}")
```

**短路求值：效率的智慧**

Python 的逻辑运算符有一个重要特性：短路求值。

```python
# and 的短路求值：如果第一个为 False，不会计算第二个
def expensive_operation():
    print("执行了昂贵的操作")
    return True

x = 0
# 因为 x != 0 为 False，所以不会执行 expensive_operation()
result = (x != 0) and expensive_operation()
print(f"结果：{result}")

# or 的短路求值：如果第一个为 True，不会计算第二个
x = 5
result = (x != 0) or expensive_operation()
print(f"结果：{result}")

# 实际应用：安全的除法
def safe_divide(a, b):
    # 如果 b == 0，不会执行除法运算
    return b != 0 and a / b

print(f"safe_divide(10, 2): {safe_divide(10, 2)}")  # 5.0
print(f"safe_divide(10, 0): {safe_divide(10, 0)}")  # False
```

**真值测试：Python 的"空"哲学**

在 Python 中，不只是 `True` 和 `False` 可以用在布尔上下文中。几乎所有的值都可以被测试真假，这被称为**真值测试**。

让我们做个实验，看看什么被认为是"假"的：

```python
# 这些值在布尔上下文中都被认为是 False
false_values = [
    False,      # 显然的假值
    None,       # 空值
    0,          # 数字零
    0.0,        # 浮点零
    0j,         # 复数零
    "",         # 空字符串
    [],         # 空列表
    (),         # 空元组
    {},         # 空字典
    set(),      # 空集合
]

print("这些值被认为是 False：")
for value in false_values:
    print(f"{repr(value):>10} -> {bool(value)}")
```

**"空即假"的设计哲学**

注意到规律了吗？除了 `False` 和 `None`，所有的"零"和"空"都被认为是假的。这体现了 Python 的设计哲学：**空即假，非空即真**。

```python
# 其他所有值都是 True
true_values = [
    True,
    1,          # 非零数字
    -1,         # 负数也是真的
    3.14,       # 浮点数
    "hello",    # 非空字符串
    " ",        # 包含空格的字符串（不是空的！）
    [0],        # 包含元素的列表（即使元素是0）
    (None,),    # 包含元素的元组（即使元素是None）
    {"": ""},   # 包含元素的字典（即使键值都是空字符串）
]

print("\n这些值被认为是 True：")
for value in true_values:
    print(f"{repr(value):>15} -> {bool(value)}")
```

**真值测试的实际应用**

这种设计让代码变得非常简洁和直观：

```python
# 检查列表是否为空
def process_items(items):
    if items:  # 简洁！不需要 if len(items) > 0
        print(f"处理 {len(items)} 个项目")
        for item in items:
            print(f"  - {item}")
    else:
        print("没有项目需要处理")

process_items([1, 2, 3])  # 有项目
process_items([])         # 空列表

# 检查字符串是否为空
def greet(name):
    if name:  # 简洁！不需要 if name != ""
        print(f"你好，{name}！")
    else:
        print("你好，陌生人！")

greet("Alice")  # 有名字
greet("")       # 空字符串
greet("   ")    # 空格不是空字符串

# 检查字典是否为空
def show_config(config):
    if config:
        print("当前配置：")
        for key, value in config.items():
            print(f"  {key}: {value}")
    else:
        print("使用默认配置")

show_config({"debug": True, "port": 8080})  # 有配置
show_config({})                             # 空配置
```

**常见陷阱：空格不是空**

```python
# 这是一个常见的陷阱
user_input = "   "  # 用户只输入了空格

if user_input:
    print("用户输入了内容")  # 这会执行！
else:
    print("用户没有输入内容")

# 正确的检查方式
if user_input.strip():  # 去除空格后再检查
    print("用户输入了有效内容")
else:
    print("用户没有输入有效内容")

# 更健壮的检查函数
def is_valid_input(text):
    """检查输入是否有效（非空且不只是空白字符）"""
    return text and text.strip()

test_inputs = ["hello", "", "   ", "\t\n", "  world  "]
for inp in test_inputs:
    print(f"'{inp}' 是有效输入吗？{is_valid_input(inp)}")
```

**自定义类的真值测试**

你甚至可以为自己的类定义真值测试行为：

```python
class ShoppingCart:
    def __init__(self):
        self.items = []

    def add_item(self, item):
        self.items.append(item)

    def __bool__(self):
        """定义这个类的真值测试行为"""
        return len(self.items) > 0

    def __len__(self):
        """如果没有 __bool__，Python 会使用 __len__"""
        return len(self.items)

# 测试自定义真值测试
cart = ShoppingCart()
if cart:
    print("购物车有商品")
else:
    print("购物车是空的")  # 这会执行

cart.add_item("苹果")
if cart:
    print("购物车有商品")  # 现在这会执行
else:
    print("购物车是空的")
```

## None：表示"无"的艺术

**None：Python 的"空"概念**

在编程中，我们经常需要表示"没有值"或"空"的概念。不同的语言有不同的方式：C 有 NULL，Java 有 null，JavaScript 有 null 和 undefined。Python 有 `None`。

```python
# None 是一个特殊的单例对象
result = None
print(f"结果：{result}")
print(f"类型：{type(result)}")
print(f"None 的 ID：{id(None)}")

# 所有的 None 都是同一个对象
another_none = None
print(f"另一个 None 的 ID：{id(another_none)}")
print(f"它们是同一个对象吗？{result is another_none}")  # True
```

**None 的来源：函数的默认返回值**

当函数没有显式返回值时，Python 会返回 `None`：

```python
def greet(name):
    print(f"Hello, {name}!")
    # 没有 return 语句

def calculate_something():
    x = 5 + 3
    # 计算了，但没有返回

# 这些函数都返回 None
result1 = greet("Alice")
result2 = calculate_something()

print(f"greet 返回：{result1}")
print(f"calculate_something 返回：{result2}")

# 即使有 return 语句，不带值也返回 None
def early_return(condition):
    if condition:
        return  # 等价于 return None
    return "正常返回"

print(f"early_return(True)：{early_return(True)}")
print(f"early_return(False)：{early_return(False)}")
```

**None 作为默认参数：避免可变默认参数陷阱**

这是一个重要的 Python 最佳实践：

```python
# 错误的做法：可变默认参数
def bad_function(items=[]):  # 危险！
    items.append("新项目")
    return items

# 看看会发生什么
list1 = bad_function()
list2 = bad_function()
print(f"第一次调用：{list1}")
print(f"第二次调用：{list2}")  # 包含了第一次的结果！

# 正确的做法：使用 None 作为默认值
def good_function(items=None):
    if items is None:
        items = []  # 每次都创建新列表
    items.append("新项目")
    return items

list3 = good_function()
list4 = good_function()
print(f"第一次调用：{list3}")
print(f"第二次调用：{list4}")  # 独立的列表

# 更复杂的例子
def process_data(data, options=None):
    if options is None:
        options = {"verbose": False, "timeout": 30}

    # 安全地修改 options
    options = options.copy()  # 创建副本
    options["processed"] = True

    return f"处理数据：{data}，选项：{options}"

result = process_data("test")
print(result)
```

**检查 None：is vs ==**

检查 `None` 时，应该使用 `is` 而不是 `==`：

```python
value = None

# 正确的方式
if value is None:
    print("值是 None")

if value is not None:
    print("值不是 None")

# 不推荐的方式（虽然通常也能工作）
if value == None:
    print("值等于 None")

# 为什么要用 is？
class WeirdClass:
    def __eq__(self, other):
        return True  # 总是返回 True

weird = WeirdClass()
print(f"weird == None: {weird == None}")  # True（但 weird 不是 None）
print(f"weird is None: {weird is None}")  # False（正确）

# None 在布尔上下文中是 False
if not value:
    print("值是假的（可能是 None、空字符串、空列表等）")

# 区分 None 和其他假值
def check_value(val):
    if val is None:
        return "值是 None"
    elif not val:
        return "值是假的但不是 None"
    else:
        return "值是真的"

test_values = [None, "", 0, [], "hello"]
for val in test_values:
    print(f"{repr(val):>10}: {check_value(val)}")
```

**None 的实际应用场景**

```python
# 1. 可选参数
class Person:
    def __init__(self, name, email=None, phone=None):
        self.name = name
        self.email = email
        self.phone = phone

    def contact_info(self):
        info = [self.name]
        if self.email is not None:
            info.append(f"Email: {self.email}")
        if self.phone is not None:
            info.append(f"Phone: {self.phone}")
        return ", ".join(info)

person1 = Person("Alice", "alice@example.com")
person2 = Person("Bob", phone="123-456-7890")
person3 = Person("Charlie")

print(person1.contact_info())
print(person2.contact_info())
print(person3.contact_info())

# 2. 缓存和延迟计算
class ExpensiveCalculation:
    def __init__(self):
        self._result = None  # 缓存结果

    def get_result(self):
        if self._result is None:
            print("执行昂贵的计算...")
            self._result = sum(range(1000000))  # 模拟昂贵计算
        return self._result

calc = ExpensiveCalculation()
print(f"第一次调用：{calc.get_result()}")  # 会执行计算
print(f"第二次调用：{calc.get_result()}")  # 使用缓存

# 3. 状态表示
class Task:
    def __init__(self, name):
        self.name = name
        self.result = None  # 任务还没完成
        self.error = None   # 没有错误

    def execute(self):
        try:
            # 模拟任务执行
            self.result = f"任务 {self.name} 完成"
        except Exception as e:
            self.error = str(e)

    def is_completed(self):
        return self.result is not None

    def has_error(self):
        return self.error is not None

task = Task("数据处理")
print(f"任务完成了吗？{task.is_completed()}")
task.execute()
print(f"任务完成了吗？{task.is_completed()}")
print(f"结果：{task.result}")
```

## 类型检查：在动态世界中寻找确定性

**运行时的类型发现**

在动态类型语言中，变量的类型在运行时确定。有时我们需要知道变量的确切类型：

```python
# 检查变量类型
name = "Alice"
age = 25
height = 1.75
is_student = True
data = None

variables = [name, age, height, is_student, data]
for var in variables:
    print(f"{repr(var):>10} 的类型是 {type(var).__name__}")
```

**type() vs isinstance()：选择正确的工具**

Python 提供了两种主要的类型检查方式，但它们有重要区别：

```python
# type() 检查确切类型
print(f"type(True) == bool: {type(True) == bool}")    # True
print(f"type(True) == int: {type(True) == int}")      # False

# isinstance() 考虑继承关系
print(f"isinstance(True, bool): {isinstance(True, bool)}")  # True
print(f"isinstance(True, int): {isinstance(True, int)}")    # True！

# 为什么？因为 bool 是 int 的子类
print(f"bool 是 int 的子类吗？{issubclass(bool, int)}")  # True

# 实际例子：检查数字类型
def process_number(value):
    if isinstance(value, (int, float)):  # 接受整数或浮点数
        return value * 2
    else:
        raise TypeError(f"期望数字，得到 {type(value).__name__}")

print(process_number(5))      # 10
print(process_number(3.14))   # 6.28
print(process_number(True))   # 2（因为 bool 是 int 的子类）

try:
    process_number("5")
except TypeError as e:
    print(f"错误：{e}")
```

**类型转换：数据的变形**

类型转换是将一种类型的数据转换为另一种类型：

```python
# 基本类型转换
original_values = ["123", 3.14, True, None]

print("类型转换示例：")
for value in original_values:
    print(f"\n原值：{repr(value)} ({type(value).__name__})")

    # 尝试转换为不同类型
    conversions = [
        ("int", int),
        ("float", float),
        ("str", str),
        ("bool", bool)
    ]

    for name, converter in conversions:
        try:
            result = converter(value)
            print(f"  转为 {name}: {repr(result)}")
        except (ValueError, TypeError) as e:
            print(f"  转为 {name}: 失败 ({e.__class__.__name__})")
```

**类型转换的陷阱和惊喜**

```python
# 字符串转数字：常见陷阱
test_strings = ["123", "3.14", "  42  ", "1e5", "abc", ""]

print("字符串转数字：")
for s in test_strings:
    try:
        int_result = int(s)
        print(f"int('{s}') = {int_result}")
    except ValueError:
        print(f"int('{s}') = 失败")

print("\n浮点数转整数：截断行为")
float_values = [3.14, 3.99, -2.7, -2.1]
for f in float_values:
    print(f"int({f}) = {int(f)}")  # 注意：是截断，不是四舍五入

print("\n布尔转换的惊喜：")
bool_tests = [0, 1, -1, "", "False", [], [0], None]
for value in bool_tests:
    print(f"bool({repr(value)}) = {bool(value)}")
```

**安全的类型转换**

在实际项目中，我们需要处理不可靠的数据：

```python
def safe_convert(value, target_type, default=None):
    """安全地转换类型，失败时返回默认值"""
    try:
        return target_type(value)
    except (ValueError, TypeError):
        return default

# 更智能的转换函数
def smart_convert_to_number(value):
    """智能地将值转换为数字"""
    if isinstance(value, (int, float)):
        return value

    if isinstance(value, str):
        value = value.strip()
        if not value:
            return None

        # 尝试转换为整数
        try:
            return int(value)
        except ValueError:
            pass

        # 尝试转换为浮点数
        try:
            return float(value)
        except ValueError:
            pass

    return None

# 测试智能转换
test_values = [42, "123", "  3.14  ", "1e5", "abc", "", None, []]
for value in test_values:
    result = smart_convert_to_number(value)
    print(f"{repr(value):>10} -> {result}")

# 实际应用：处理用户输入
def get_user_age():
    """获取用户年龄，包含类型转换和验证"""
    while True:
        user_input = input("请输入您的年龄：")

        age = smart_convert_to_number(user_input)
        if age is None:
            print("请输入有效的数字")
            continue

        if not isinstance(age, int) or age < 0 or age > 150:
            print("年龄必须是 0-150 之间的整数")
            continue

        return age

# 注释掉以避免在演示中阻塞
# age = get_user_age()
# print(f"您的年龄是：{age}")
```

## 总结：数据类型的深层理解

通过深入学习 Python 的基本数据类型，我们不仅掌握了语法，更重要的是理解了数据在计算机中的表示和处理方式。

**核心洞察：**

1. **整数的"无限"特性**：Python 的任意精度算术让我们不用担心整数溢出
2. **浮点数的精度陷阱**：理解二进制表示的限制，知道何时使用 `decimal` 模块
3. **复数的实用性**：不只是数学概念，在科学计算中很有用
4. **布尔值的数值本质**：`True` 和 `False` 实际上是 1 和 0
5. **真值测试的哲学**：空即假，非空即真
6. **None 的重要性**：表示"无"的概念，避免可变默认参数陷阱

**实践智慧：**

- **进制转换**：理解不同进制在不同场景中的应用
- **科学计数法**：处理极大或极小的数字
- **精度控制**：金融计算使用 `decimal`，科学计算注意浮点精度
- **类型检查**：使用 `isinstance()` 而不是 `type()`
- **安全转换**：处理不可靠数据时使用异常处理

**设计思想：**

Python 的数据类型设计体现了语言的核心哲学：
- **简洁性**：语法简单，概念清晰
- **一致性**：真值测试、类型转换等行为一致
- **实用性**：满足从简单脚本到复杂科学计算的需求
- **安全性**：提供工具来处理类型相关的错误

理解这些基本数据类型不仅是学习 Python 语法，更是理解计算机如何表示和处理信息的基础。这些知识将在你处理更复杂的数据结构和算法时发挥重要作用。

记住：数据类型不只是语法规则，它们是我们与计算机沟通的基本词汇。掌握了这些"词汇"，你就能更准确地表达你的编程意图。
