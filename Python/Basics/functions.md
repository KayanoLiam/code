# 函数

函数是组织代码的基本单位，让你可以将代码分解成可重用的块。

## 定义和调用函数

### 基本函数定义

```python
# === 最简单的函数 ===
def greet():
    """这是一个简单的问候函数"""
    print("Hello, World!")

# 调用函数
greet()  # 输出：Hello, World!

# === 带参数的函数 ===
def greet_person(name):
    """问候指定的人"""
    return f"你好，{name}！"

# 调用函数并获取返回值
message = greet_person("小明")
print(message)  # 输出：你好，小明！

# === 带多个参数的函数 ===
def add_numbers(a, b):
    """计算两个数的和"""
    result = a + b
    return result

sum_result = add_numbers(5, 3)
print(f"5 + 3 = {sum_result}")

# === 带默认参数的函数 ===
def introduce(name, age=18, city="北京"):
    """自我介绍函数，age和city有默认值"""
    return f"我叫{name}，{age}岁，来自{city}"

# 不同的调用方式
print(introduce("小红"))                    # 使用默认值
print(introduce("小刚", 25))               # 部分使用默认值
print(introduce("小丽", 22, "上海"))        # 全部指定
print(introduce("小王", city="深圳"))       # 跳过中间参数

# === 文档字符串 (Docstring) ===
def calculate_area(length, width):
    """
    计算矩形面积
    
    参数:
        length (float): 矩形的长
        width (float): 矩形的宽
    
    返回:
        float: 矩形的面积
    """
    return length * width

# 查看函数文档
print(calculate_area.__doc__)
help(calculate_area)  # 显示详细帮助信息
```

## 参数的类型和传递方式

```python
# === 位置参数和关键字参数 ===
def calculate(a, b, operation="add"):
    """执行基本数学运算"""
    if operation == "add":
        return a + b
    elif operation == "subtract":
        return a - b
    elif operation == "multiply":
        return a * b
    elif operation == "divide":
        if b != 0:
            return a / b
        else:
            return "错误：除数不能为零"
    else:
        return "不支持的运算"

# 不同的调用方式
result1 = calculate(10, 5)                          # 位置参数，使用默认operation
result2 = calculate(10, 5, "multiply")              # 位置参数
result3 = calculate(a=10, b=5, operation="divide")  # 关键字参数
result4 = calculate(10, b=5, operation="subtract")  # 混合使用

print(f"10 + 5 = {result1}")
print(f"10 × 5 = {result2}")
print(f"10 ÷ 5 = {result3}")
print(f"10 - 5 = {result4}")

# === 可变位置参数 (*args) ===
def sum_all(*numbers):
    """计算所有传入数字的和"""
    print(f"接收到的参数：{numbers}")  # numbers是一个元组
    return sum(numbers)

print(f"sum_all(1, 2, 3) = {sum_all(1, 2, 3)}")
print(f"sum_all(1, 2, 3, 4, 5) = {sum_all(1, 2, 3, 4, 5)}")

# 传递列表给*args
number_list = [10, 20, 30]
print(f"sum_all(*number_list) = {sum_all(*number_list)}")  # 解包列表

# === 可变关键字参数 (**kwargs) ===
def print_info(**kwargs):
    """打印所有传入的关键字参数"""
    print("接收到的信息：")
    for key, value in kwargs.items():
        print(f"  {key}: {value}")

print_info(name="小明", age=20, city="北京", hobby="编程")

# 传递字典给**kwargs
person_info = {"name": "小红", "age": 22, "major": "计算机科学"}
print_info(**person_info)  # 解包字典

# === 混合使用所有参数类型 ===
def complex_function(required_arg, default_arg="默认值", *args, **kwargs):
    """演示所有参数类型的函数"""
    print(f"必需参数：{required_arg}")
    print(f"默认参数：{default_arg}")
    print(f"可变位置参数：{args}")
    print(f"可变关键字参数：{kwargs}")

complex_function("必需的", "自定义默认值", 1, 2, 3, name="Alice", age=25)

# === 强制关键字参数（Python 3+）===
def create_user(name, *, age, email):
    """创建用户，age和email必须用关键字传递"""
    return {
        "name": name,
        "age": age,
        "email": email
    }

# 正确调用
user = create_user("Alice", age=25, email="alice@example.com")
print(f"用户信息：{user}")

# 错误调用（会报错）
# user = create_user("Alice", 25, "alice@example.com")  # TypeError
```

## 函数的返回值

```python
# === 单个返回值 ===
def square(x):
    return x ** 2

result = square(5)
print(f"5的平方是：{result}")

# === 多个返回值（实际返回元组）===
def get_name_age():
    name = "Bob"
    age = 30
    return name, age  # 返回元组

# 接收多个返回值
name, age = get_name_age()
print(f"姓名：{name}，年龄：{age}")

# 也可以作为元组接收
info = get_name_age()
print(f"信息：{info}")

# === 条件返回 ===
def divide_safe(a, b):
    """安全除法，避免除零错误"""
    if b == 0:
        return None, "错误：除数不能为零"
    else:
        return a / b, "成功"

result, message = divide_safe(10, 2)
print(f"10 ÷ 2 = {result}, {message}")

result, message = divide_safe(10, 0)
print(f"10 ÷ 0 = {result}, {message}")

# === 没有return语句的函数 ===
def print_greeting(name):
    print(f"Hello, {name}!")
    # 没有return语句，默认返回None

result = print_greeting("Alice")
print(f"函数返回值：{result}")  # None

# === 提前返回 ===
def check_password(password):
    """检查密码强度"""
    if len(password) < 8:
        return "密码太短"
    
    if not any(c.isdigit() for c in password):
        return "密码必须包含数字"
    
    if not any(c.isupper() for c in password):
        return "密码必须包含大写字母"
    
    return "密码强度良好"

print(check_password("123"))           # 密码太短
print(check_password("abcdefgh"))      # 密码必须包含数字
print(check_password("abcdefgh123"))   # 密码必须包含大写字母
print(check_password("Abcdefgh123"))   # 密码强度良好
```

## 作用域和变量

```python
# === 全局变量和局部变量 ===
global_var = "我是全局变量"

def test_scope():
    local_var = "我是局部变量"
    print(f"函数内部：{global_var}")  # 可以访问全局变量
    print(f"函数内部：{local_var}")

test_scope()
print(f"函数外部：{global_var}")
# print(f"函数外部：{local_var}")  # 错误！局部变量在函数外不可访问

# === 修改全局变量 ===
counter = 0

def increment():
    global counter  # 声明要修改全局变量
    counter += 1
    print(f"计数器：{counter}")

increment()  # 计数器：1
increment()  # 计数器：2
print(f"全局计数器：{counter}")  # 全局计数器：2

# === 嵌套函数和闭包 ===
def outer_function(x):
    """外部函数"""
    def inner_function(y):
        """内部函数，可以访问外部函数的变量"""
        return x + y
    
    return inner_function

# 创建闭包
add_10 = outer_function(10)
result = add_10(5)
print(f"闭包结果：{result}")  # 15

# === nonlocal 关键字 ===
def make_counter():
    count = 0
    
    def counter():
        nonlocal count  # 声明要修改外层函数的变量
        count += 1
        return count
    
    return counter

# 创建计数器
my_counter = make_counter()
print(f"第1次调用：{my_counter()}")  # 1
print(f"第2次调用：{my_counter()}")  # 2
print(f"第3次调用：{my_counter()}")  # 3
```

## 高级函数概念

```python
# === 函数作为参数 ===
def apply_operation(numbers, operation):
    """对数字列表应用指定操作"""
    return [operation(x) for x in numbers]

def square(x):
    return x ** 2

def double(x):
    return x * 2

numbers = [1, 2, 3, 4, 5]
squared = apply_operation(numbers, square)
doubled = apply_operation(numbers, double)

print(f"原数字：{numbers}")
print(f"平方：{squared}")
print(f"翻倍：{doubled}")

# === Lambda 函数（匿名函数）===
# 语法：lambda 参数: 表达式

# 简单的lambda函数
add = lambda x, y: x + y
print(f"lambda加法：{add(3, 5)}")

# 在高阶函数中使用lambda
numbers = [1, 2, 3, 4, 5]
cubed = apply_operation(numbers, lambda x: x ** 3)
print(f"立方：{cubed}")

# 内置高阶函数
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# map：对每个元素应用函数
squared = list(map(lambda x: x**2, numbers))
print(f"map平方：{squared}")

# filter：过滤元素
evens = list(filter(lambda x: x % 2 == 0, numbers))
print(f"filter偶数：{evens}")

# sorted：排序时使用key函数
words = ["apple", "pie", "a", "longer"]
sorted_by_length = sorted(words, key=lambda x: len(x))
print(f"按长度排序：{sorted_by_length}")

# === 装饰器简介 ===
def timer_decorator(func):
    """简单的计时装饰器"""
    import time
    
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        print(f"{func.__name__} 执行时间：{end_time - start_time:.4f}秒")
        return result
    
    return wrapper

@timer_decorator
def slow_function():
    """一个慢函数"""
    import time
    time.sleep(1)
    return "完成"

result = slow_function()
print(f"结果：{result}")

# === 递归函数 ===
def factorial(n):
    """计算阶乘的递归函数"""
    if n <= 1:
        return 1
    else:
        return n * factorial(n - 1)

print(f"5的阶乘：{factorial(5)}")  # 120

def fibonacci(n):
    """计算斐波那契数列的递归函数"""
    if n <= 1:
        return n
    else:
        return fibonacci(n - 1) + fibonacci(n - 2)

print(f"斐波那契数列前10项：")
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")
```

## 函数的最佳实践

```python
# === 单一职责原则 ===
# 好的函数：只做一件事
def calculate_tax(amount, rate):
    """计算税额"""
    return amount * rate

def format_currency(amount):
    """格式化货币显示"""
    return f"¥{amount:.2f}"

# 不好的函数：做太多事情
def bad_function(amount, rate):
    """不好的例子：计算税额并格式化显示"""
    tax = amount * rate
    return f"¥{tax:.2f}"

# === 纯函数 vs 有副作用的函数 ===
# 纯函数：相同输入总是产生相同输出，无副作用
def pure_add(a, b):
    return a + b

# 有副作用的函数：修改全局状态
total = 0
def impure_add(a, b):
    global total
    total += a + b  # 副作用：修改全局变量
    return a + b

# === 类型提示（Python 3.5+）===
def calculate_area(length: float, width: float) -> float:
    """计算矩形面积，使用类型提示"""
    return length * width

def process_names(names: list[str]) -> list[str]:
    """处理姓名列表，返回大写版本"""
    return [name.upper() for name in names]

# === 错误处理 ===
def safe_divide(a: float, b: float) -> float:
    """安全除法，包含错误处理"""
    if not isinstance(a, (int, float)) or not isinstance(b, (int, float)):
        raise TypeError("参数必须是数字")
    
    if b == 0:
        raise ValueError("除数不能为零")
    
    return a / b

# 使用示例
try:
    result = safe_divide(10, 2)
    print(f"结果：{result}")
    
    result = safe_divide(10, 0)  # 会抛出异常
except (TypeError, ValueError) as e:
    print(f"错误：{e}")
```

## 总结

- **基本定义**：def 关键字，参数，返回值，文档字符串
- **参数类型**：位置参数，关键字参数，默认参数，*args，**kwargs
- **返回值**：单个值，多个值，条件返回，None
- **作用域**：局部变量，全局变量，global，nonlocal，闭包
- **高级概念**：高阶函数，lambda，装饰器，递归
- **最佳实践**：单一职责，纯函数，类型提示，错误处理

函数是代码复用和模块化的基础，掌握函数的各种特性对编写高质量的 Python 代码至关重要！
