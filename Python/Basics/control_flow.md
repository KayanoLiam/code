# 控制流

控制流决定了程序的执行顺序。Python 提供了条件语句、循环和跳转语句来控制程序流程。

## 条件语句：根据条件执行不同代码

### if-elif-else 语句

```python
# === 基本 if 语句 ===
age = 18
if age >= 18:
    print("你已经成年了")

# === if-else 语句 ===
score = 85
if score >= 60:
    print("恭喜，你及格了！")
else:
    print("很遗憾，你没有及格")

# === if-elif-else 语句 ===
score = 85

if score >= 90:
    grade = "A"
    comment = "优秀"
elif score >= 80:
    grade = "B"
    comment = "良好"
elif score >= 70:
    grade = "C"
    comment = "中等"
elif score >= 60:
    grade = "D"
    comment = "及格"
else:
    grade = "F"
    comment = "不及格"

print(f"成绩：{score}分，等级：{grade}，评价：{comment}")

# === 复杂条件 ===
age = 20
has_license = True
has_car = False

if age >= 18 and has_license:
    if has_car:
        print("你可以开车出行")
    else:
        print("你可以租车或借车")
elif age >= 16:
    print("你可以学习驾驶")
else:
    print("你还太小，不能开车")

# === 条件表达式（三元运算符）===
# 语法：值1 if 条件 else 值2
status = "及格" if score >= 60 else "不及格"
print(f"考试状态：{status}")

# 更复杂的条件表达式
weather = "sunny"
activity = "去公园" if weather == "sunny" else "在家看书" if weather == "rainy" else "去购物"
print(f"今天天气{weather}，建议{activity}")
```

### 检查多个条件

```python
# === 使用 and ===
username = "admin"
password = "123456"

if username == "admin" and password == "123456":
    print("登录成功")
else:
    print("用户名或密码错误")

# === 使用 or ===
day = "Saturday"
if day == "Saturday" or day == "Sunday":
    print("今天是周末")
else:
    print("今天是工作日")

# === 使用 not ===
is_raining = False
if not is_raining:
    print("天气不错，可以出门")

# === 使用 in 检查成员关系 ===
fruit = "apple"
if fruit in ["apple", "banana", "orange"]:
    print(f"{fruit}是我们有的水果")

# 检查字符串
text = "Hello World"
if "World" in text:
    print("找到了World")

# 检查字典键
student = {"name": "Alice", "age": 20}
if "email" in student:
    print(f"邮箱：{student['email']}")
else:
    print("没有邮箱信息")

# === 短路求值 ===
# and：如果第一个条件为 False，不会检查第二个条件
x = 0
if x != 0 and 10 / x > 1:  # 不会执行除法，避免除零错误
    print("条件成立")

# or：如果第一个条件为 True，不会检查第二个条件
name = "Alice"
if name or len(name) > 0:  # 不会执行 len(name)
    print("有名字")
```

## 循环：重复执行代码

### for 循环：遍历序列

```python
# === 遍历列表 ===
fruits = ["苹果", "香蕉", "橙子", "葡萄"]
print("我喜欢的水果：")
for fruit in fruits:
    print(f"  - {fruit}")

# === 遍历字符串 ===
word = "Python"
print(f"'{word}'的每个字母：")
for char in word:
    print(f"  {char}")

# === 遍历字典 ===
student = {"name": "Alice", "age": 20, "major": "CS"}

# 遍历键
print("学生信息的键：")
for key in student:
    print(f"  {key}")

# 遍历值
print("学生信息的值：")
for value in student.values():
    print(f"  {value}")

# 遍历键值对
print("完整的学生信息：")
for key, value in student.items():
    print(f"  {key}: {value}")

# === 使用 range() ===
# range(stop)：从0到stop-1
print("0到4：")
for i in range(5):
    print(f"  {i}")

# range(start, stop)：从start到stop-1
print("1到5：")
for i in range(1, 6):
    print(f"  {i}")

# range(start, stop, step)：指定步长
print("0到10的偶数：")
for i in range(0, 11, 2):
    print(f"  {i}")

# 倒序
print("5到1倒数：")
for i in range(5, 0, -1):
    print(f"  {i}")

# === 带索引的遍历 ===
fruits = ["苹果", "香蕉", "橙子"]

# 使用 enumerate()
print("带索引的水果列表：")
for index, fruit in enumerate(fruits):
    print(f"  {index}: {fruit}")

# 从指定数字开始索引
print("从1开始的索引：")
for index, fruit in enumerate(fruits, 1):
    print(f"  {index}. {fruit}")

# === 同时遍历多个序列 ===
names = ["Alice", "Bob", "Charlie"]
ages = [20, 25, 30]
cities = ["北京", "上海", "广州"]

print("学生信息：")
for name, age, city in zip(names, ages, cities):
    print(f"  {name}, {age}岁, 来自{city}")

# === 嵌套循环 ===
print("乘法表：")
for i in range(1, 4):
    for j in range(1, 4):
        result = i * j
        print(f"{i} × {j} = {result}")
    print()  # 空行分隔

# 创建矩阵
matrix = []
for i in range(3):
    row = []
    for j in range(3):
        row.append(i * 3 + j + 1)
    matrix.append(row)

print("3x3矩阵：")
for row in matrix:
    print(row)
```

### while 循环：基于条件的循环

```python
# === 基本 while 循环 ===
count = 0
print("倒计时：")
while count < 5:
    print(f"  {count}")
    count += 1
print("循环结束")

# === 用户输入循环 ===
print("猜数字游戏（1-10）：")
import random
secret_number = random.randint(1, 10)
guess = 0
attempts = 0

while guess != secret_number and attempts < 3:
    try:
        guess = int(input("请输入你的猜测："))
        attempts += 1
        if guess < secret_number:
            print("太小了！")
        elif guess > secret_number:
            print("太大了！")
        else:
            print(f"恭喜你猜对了！用了{attempts}次")
    except ValueError:
        print("请输入一个有效的数字")

if guess != secret_number:
    print(f"游戏结束！答案是{secret_number}")

# === 无限循环（需要 break 退出）===
print("简单计算器（输入 'quit' 退出）：")
while True:
    user_input = input("请输入表达式（如 2+3）或 'quit'：")
    
    if user_input.lower() == 'quit':
        print("再见！")
        break
    
    try:
        # 注意：eval在实际项目中要谨慎使用
        result = eval(user_input)
        print(f"结果：{result}")
    except:
        print("无效的表达式，请重试")

# === 累积计算 ===
# 计算1到100的和
total = 0
number = 1
while number <= 100:
    total += number
    number += 1
print(f"1到100的和：{total}")

# 阶乘计算
n = 5
factorial = 1
i = 1
while i <= n:
    factorial *= i
    i += 1
print(f"{n}的阶乘：{factorial}")
```

## 循环控制：break、continue、else

```python
# === break：立即退出循环 ===
print("寻找第一个偶数：")
numbers = [1, 3, 5, 8, 9, 10, 11]
for num in numbers:
    print(f"检查 {num}")
    if num % 2 == 0:
        print(f"找到第一个偶数：{num}")
        break
else:
    print("没有找到偶数")  # 只有循环正常结束才执行

# === continue：跳过当前迭代 ===
print("\n只打印奇数：")
for i in range(10):
    if i % 2 == 0:
        continue  # 跳过偶数
    print(f"奇数：{i}")

# === 循环的 else 子句 ===
# for-else：循环正常结束时执行else
print("\n寻找质数：")
def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True

number = 17
for i in range(2, int(number**0.5) + 1):
    if number % i == 0:
        print(f"{number} 不是质数，因为它能被 {i} 整除")
        break
else:
    print(f"{number} 是质数")

# while-else：循环条件为False时执行else
print("\n倒计时：")
count = 3
while count > 0:
    print(f"{count}...")
    count -= 1
    if count == 1:  # 假设某个条件下需要提前退出
        print("紧急停止！")
        break
else:
    print("时间到！")  # 只有正常结束才会执行

# === 嵌套循环的控制 ===
print("\n在矩阵中寻找特定值：")
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

target = 5
found = False

for i, row in enumerate(matrix):
    for j, value in enumerate(row):
        if value == target:
            print(f"在位置 ({i}, {j}) 找到了 {target}")
            found = True
            break
    if found:
        break
else:
    print(f"没有找到 {target}")

# === 实用示例：输入验证 ===
print("\n年龄输入验证：")
while True:
    try:
        age = int(input("请输入你的年龄（0-150）："))
        if 0 <= age <= 150:
            print(f"你的年龄是 {age} 岁")
            break
        else:
            print("年龄必须在0-150之间")
    except ValueError:
        print("请输入一个有效的数字")
    except KeyboardInterrupt:
        print("\n程序被用户中断")
        break
```

## 实用的控制流模式

```python
# === 处理可选值 ===
def process_user_data(data):
    # 使用 if-elif 处理不同情况
    if not data:
        return "无数据"
    elif isinstance(data, str):
        return data.upper()
    elif isinstance(data, (int, float)):
        return f"数字：{data}"
    elif isinstance(data, list):
        return f"列表长度：{len(data)}"
    else:
        return f"未知类型：{type(data)}"

# 测试
test_cases = [None, "", "hello", 42, [1, 2, 3], {"key": "value"}]
for case in test_cases:
    result = process_user_data(case)
    print(f"{case} -> {result}")

# === 循环中的异常处理 ===
def safe_division():
    while True:
        try:
            a = float(input("输入被除数（或 'quit' 退出）："))
            b = float(input("输入除数："))
            result = a / b
            print(f"{a} ÷ {b} = {result}")
            break
        except ValueError:
            print("请输入有效的数字")
        except ZeroDivisionError:
            print("除数不能为零")
        except KeyboardInterrupt:
            print("\n程序被中断")
            break

# === 使用 any() 和 all() ===
# 检查是否有任何元素满足条件
numbers = [2, 4, 6, 8, 10]
has_odd = any(num % 2 == 1 for num in numbers)
print(f"是否有奇数：{has_odd}")  # False

# 检查是否所有元素都满足条件
all_even = all(num % 2 == 0 for num in numbers)
print(f"是否都是偶数：{all_even}")  # True

# 实际应用：验证密码强度
def check_password_strength(password):
    checks = [
        len(password) >= 8,
        any(c.isupper() for c in password),
        any(c.islower() for c in password),
        any(c.isdigit() for c in password),
        any(c in "!@#$%^&*" for c in password)
    ]
    
    if all(checks):
        return "强密码"
    elif sum(checks) >= 3:
        return "中等密码"
    else:
        return "弱密码"

passwords = ["123456", "Password", "Password123", "Password123!"]
for pwd in passwords:
    strength = check_password_strength(pwd)
    print(f"'{pwd}' -> {strength}")
```

## 总结

- **条件语句**：if-elif-else，条件表达式，逻辑运算符
- **for 循环**：遍历序列，range()，enumerate()，zip()，嵌套循环
- **while 循环**：基于条件，用户输入，累积计算
- **循环控制**：break（退出），continue（跳过），else（正常结束）
- **实用模式**：异常处理，any()/all()，输入验证

掌握控制流是编程的核心技能，它让程序能够根据不同情况做出不同的响应！
