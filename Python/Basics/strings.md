# 字符串的秘密世界

深入探索 Python 的**字符串**，这个看似简单却蕴含无穷奥秘的数据类型。

**第一印象：字符串就是"文字"？**

当你第一次接触 Python 时，可能写过这样的代码：

```python
message = "Hello, World!"
print(message)
```

看起来很简单，对吧？但这背后隐藏着计算机科学中一些最有趣的概念。让我们从一个看似简单的问题开始：**什么是字符串？**

**字符串的本质：不只是文字那么简单**

在计算机的世界里，字符串不仅仅是我们看到的文字。它是：
- **字符的序列**：每个字符都有自己的位置
- **不可变的对象**：一旦创建就不能修改
- **Unicode 的容器**：可以包含世界上任何语言的文字
- **数据的载体**：承载着信息和意义

让我们用一个实验来理解这些概念：

```python
# 看似简单的字符串，实际上包含了丰富的信息
text = "Hello, 世界! 🌍"

print(f"字符串内容：{text}")
print(f"字符串长度：{len(text)}")
print(f"内存地址：{id(text)}")
print(f"字符串类型：{type(text)}")

# 让我们看看每个字符
for i, char in enumerate(text):
    print(f"位置 {i}: '{char}' (Unicode: {ord(char)})")
```

运行这段代码，你会发现一个"简单"的字符串实际上包含了英文字母、中文汉字、标点符号和表情符号，每个字符都有自己的 Unicode 编码！

**字符串创建的艺术：不只是加引号**

Python 提供了多种创建字符串的方式，每种都有其特定的用途和哲学：

```python
# 方式1：单引号 - 简洁明了
name = 'Alice'
print(f"单引号字符串：{name}")

# 方式2：双引号 - 包含单引号时很有用
quote = "He said 'Hello there!'"
print(f"双引号字符串：{quote}")

# 方式3：三引号 - 多行文本的优雅解决方案
poem = """
静夜思
李白

床前明月光，
疑是地上霜。
举头望明月，
低头思故乡。
"""
print(f"三引号字符串：{poem}")

# 方式4：原始字符串 - 转义字符的"避难所"
file_path = r"C:\Users\Alice\Documents\新建文件夹\file.txt"
regex_pattern = r"\d{4}-\d{2}-\d{2}"  # 日期正则表达式
print(f"文件路径：{file_path}")
print(f"正则表达式：{regex_pattern}")
```

**为什么需要这么多种方式？**

这体现了 Python 的设计哲学：**为不同的场景提供最合适的工具**。

- **单引号**：日常使用，简洁
- **双引号**：包含单引号时避免转义
- **三引号**：多行文本，保持格式
- **原始字符串**：处理路径和正则表达式时避免转义地狱

**转义字符：特殊字符的"化身术"**

有些字符无法直接在字符串中表示，这时就需要转义字符：

```python
# 常见转义字符的实际应用
print("这是第一行\n这是第二行")  # \n 换行
print("姓名\t年龄\t职业")        # \t 制表符
print("她说：\"今天天气真好！\"")  # \" 双引号
print("文件路径：C:\\Users\\Alice")  # \\ 反斜杠

# 转义字符的"陷阱"
windows_path = "C:\new_folder\test.txt"  # 错误！\n 和 \t 被解释为转义字符
print(f"错误的路径：{windows_path}")

# 正确的方式
windows_path_correct = r"C:\new_folder\test.txt"  # 原始字符串
# 或者
windows_path_escaped = "C:\\new_folder\\test.txt"  # 手动转义
print(f"正确的路径1：{windows_path_correct}")
print(f"正确的路径2：{windows_path_escaped}")
```

**Unicode：字符串的国际化护照**

现代的字符串必须能处理全世界的文字，这就是 Unicode 的价值：

```python
# Unicode 让我们可以混合使用各种语言
multilingual = "Hello 你好 こんにちは مرحبا Здравствуйте"
print(f"多语言字符串：{multilingual}")

# 每个字符都有自己的 Unicode 码点
for char in "A中🐍":
    print(f"字符 '{char}': Unicode 码点 {ord(char)}")

# 我们也可以通过码点创建字符
print(f"码点 65 对应的字符：{chr(65)}")    # A
print(f"码点 20013 对应的字符：{chr(20013)}")  # 中
print(f"码点 128013 对应的字符：{chr(128013)}")  # 🐍
```

**字符串的不可变性：一个重要的设计决策**

现在我们来探讨 Python 字符串的一个核心特性：**不可变性**。这个概念初看起来可能有些反直觉，但它是 Python 设计中的一个重要决策。

**实验：字符串真的不能修改吗？**

让我们做一个实验来理解这个概念：

```python
# 创建一个字符串
original = "Hello"
print(f"原始字符串：{original}")
print(f"内存地址：{id(original)}")

# 看起来像是"修改"了字符串
modified = original + " World"
print(f"修改后：{modified}")
print(f"新的内存地址：{id(modified)}")

# 检查原始字符串是否真的被修改了
print(f"原始字符串还是：{original}")  # 还是 "Hello"
print(f"两个字符串是同一个对象吗？{original is modified}")  # False
```

**这个实验告诉我们什么？**

1. **原始字符串没有被修改**：`original` 仍然是 "Hello"
2. **创建了新的字符串对象**：`modified` 是一个全新的对象
3. **内存地址不同**：证明它们是不同的对象

这就是**不可变性**的含义：你不能修改现有的字符串，只能创建新的字符串。

**为什么要这样设计？**

这种设计有几个重要的好处：

```python
# 好处1：线程安全
# 多个线程可以安全地共享同一个字符串，不用担心被意外修改

# 好处2：可以作为字典的键
user_data = {
    "Alice": {"age": 25, "city": "北京"},
    "Bob": {"age": 30, "city": "上海"}
}
print(f"Alice 的信息：{user_data['Alice']}")

# 好处3：字符串缓存和优化
# Python 可以安全地重用相同的字符串对象
a = "hello"
b = "hello"
print(f"两个相同的字符串是同一个对象吗？{a is b}")  # 通常是 True

# 好处4：哈希值稳定
# 字符串的哈希值不会改变，适合用作集合元素
string_set = {"apple", "banana", "cherry"}
print(f"字符串集合：{string_set}")
```

**不可变性的"代价"：性能陷阱**

但是，不可变性也带来了一个重要的性能考虑：

```python
import time

# 低效的字符串拼接方式
def inefficient_concat():
    result = ""
    start_time = time.time()

    for i in range(1000):
        result += f"第{i}项 "  # 每次都创建新字符串！

    end_time = time.time()
    return result, end_time - start_time

# 高效的字符串拼接方式
def efficient_concat():
    parts = []
    start_time = time.time()

    for i in range(1000):
        parts.append(f"第{i}项 ")  # 只是添加到列表

    result = "".join(parts)  # 一次性拼接
    end_time = time.time()
    return result, end_time - start_time

# 比较性能
_, inefficient_time = inefficient_concat()
_, efficient_time = efficient_concat()

print(f"低效方式耗时：{inefficient_time:.4f}秒")
print(f"高效方式耗时：{efficient_time:.4f}秒")
print(f"性能提升：{inefficient_time / efficient_time:.1f}倍")
```

**为什么 join() 更高效？**

让我们深入理解这个差异：

```python
# 低效方式：每次拼接都创建新对象
# "a" + "b" → 创建新字符串 "ab"
# "ab" + "c" → 创建新字符串 "abc"
# "abc" + "d" → 创建新字符串 "abcd"
# ... 大量的内存分配和复制

# 高效方式：join() 的工作原理
words = ["Python", "is", "awesome"]

# join() 首先计算总长度
total_length = sum(len(word) for word in words) + len(" ") * (len(words) - 1)
print(f"总长度：{total_length}")

# 然后一次性分配内存并拼接
result = " ".join(words)
print(f"拼接结果：{result}")

# 这样只需要一次内存分配，而不是多次
```

**实际应用中的字符串拼接策略**

```python
# 场景1：少量拼接，直接用 + 或 f-string
name = "Alice"
age = 25
simple_message = f"我叫{name}，今年{age}岁"  # 简单直接

# 场景2：循环中的大量拼接，用 join()
def generate_html_list(items):
    parts = ["<ul>"]
    for item in items:
        parts.append(f"  <li>{item}</li>")
    parts.append("</ul>")
    return "\n".join(parts)

html = generate_html_list(["苹果", "香蕉", "橙子"])
print(html)

# 场景3：条件性拼接，用列表收集
def build_query_string(params):
    parts = []
    for key, value in params.items():
        if value is not None:  # 只添加非空值
            parts.append(f"{key}={value}")
    return "&".join(parts)

query = build_query_string({"name": "Alice", "age": 25, "city": None})
print(f"查询字符串：{query}")  # name=Alice&age=25
```

**字符串格式化：从混乱到优雅的进化史**

字符串格式化是编程中最常见的操作之一，Python 在这方面经历了一个有趣的进化过程。让我们从历史的角度来理解这个进化，并掌握现代最佳实践。

**第一代：% 格式化 - 历史的遗产**

最早的 Python 字符串格式化借鉴了 C 语言的 printf 风格：

```python
# % 格式化：古老但仍然可见
name = "小明"
age = 20
score = 95.5

# 基本用法
old_style = "我叫%s，今年%d岁，考了%.1f分" % (name, age, score)
print(f"老式格式化：{old_style}")

# 为什么不推荐？让我们看看问题
try:
    # 问题1：参数顺序容易搞错
    wrong_order = "我叫%d，今年%s岁" % (name, age)  # 类型不匹配
except TypeError as e:
    print(f"类型错误：{e}")

# 问题2：可读性差，特别是参数多的时候
complex_format = "用户%s在%s以%s的身份登录，IP地址%s，时间%s" % (
    "Alice", "北京", "管理员", "192.168.1.1", "2024-01-01"
)
print(f"复杂格式化：{complex_format}")
# 你能快速看出哪个%s对应哪个参数吗？
```

**第二代：str.format() - 更好的选择**

Python 2.7 引入了 `str.format()` 方法，解决了 % 格式化的很多问题：

```python
# format() 方法：更清晰的语法
name = "小明"
age = 20
score = 95.5

# 基本用法：位置参数
message = "我叫{}，今年{}岁，考了{}分".format(name, age, score)
print(f"format() 基本用法：{message}")

# 带索引：可以重复使用参数
message = "我叫{0}，今年{1}岁，{0}很努力学习".format(name, age)
print(f"带索引：{message}")

# 命名参数：最清晰的方式
message = "我叫{name}，今年{age}岁，考了{score}分".format(
    name=name, age=age, score=score
)
print(f"命名参数：{message}")

# format() 的强大格式化能力
pi = 3.14159265359
large_number = 1234567890

print(f"π 保留2位小数：{pi:.2f}")
print(f"π 保留6位小数：{pi:.6f}")
print(f"大数字加千位分隔符：{large_number:,}")
print(f"科学计数法：{large_number:.2e}")

# 对齐和填充
text = "Python"
print(f"左对齐10位：'{text:<10}'")
print(f"右对齐10位：'{text:>10}'")
print(f"居中10位：'{text:^10}'")
print(f"用星号填充：'{text:*^10}'")
```

**第三代：f-string - 现代 Python 的优雅解决方案**

Python 3.6 引入了 f-string（格式化字符串字面量），这是目前最推荐的方式：

```python
# f-string：最直观、最高效的格式化方式
name = "小明"
age = 20
score = 95.5

# 基本用法：变量直接嵌入
message = f"我叫{name}，今年{age}岁，考了{score}分"
print(f"f-string 基本用法：{message}")

# 支持表达式：在大括号内可以写任何 Python 表达式
print(f"明年我就{age + 1}岁了")
print(f"我的成绩等级：{'优秀' if score >= 90 else '良好'}")
print(f"我的名字有{len(name)}个字")

# 调用函数
def get_grade(score):
    if score >= 90:
        return "优秀"
    elif score >= 80:
        return "良好"
    else:
        return "需要努力"

print(f"成绩评价：{get_grade(score)}")

# 访问对象属性和方法
class Student:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def get_info(self):
        return f"学生{self.name}"

student = Student("小红", 18)
print(f"学生信息：{student.get_info()}，年龄{student.age}")
```

**f-string 的高级格式化技巧**

```python
# 数字格式化
pi = 3.14159265359
large_number = 1234567890
percentage = 0.8567

print(f"π 保留2位小数：{pi:.2f}")
print(f"π 保留4位小数：{pi:.4f}")
print(f"大数字：{large_number:,}")  # 千位分隔符
print(f"科学计数法：{large_number:.2e}")
print(f"百分比：{percentage:.1%}")  # 85.7%

# 进制转换
number = 255
print(f"十进制：{number}")
print(f"二进制：{number:b}")
print(f"八进制：{number:o}")
print(f"十六进制：{number:x}")
print(f"十六进制（大写）：{number:X}")

# 对齐和填充
text = "Python"
print(f"左对齐：'{text:<15}'")
print(f"右对齐：'{text:>15}'")
print(f"居中：'{text:^15}'")
print(f"用等号填充：'{text:=^15}'")
print(f"用星号填充：'{text:*^15}'")

# 数字填充
number = 42
print(f"填充零：{number:05d}")  # 00042
print(f"正数显示符号：{number:+d}")  # +42
print(f"负数显示符号：{-number:+d}")  # -42
```

**实际应用：构建复杂的格式化字符串**

```python
# 实际场景：生成报表
def generate_sales_report(sales_data):
    """生成销售报表"""
    total_sales = sum(sales_data.values())

    print("=" * 50)
    print(f"{'销售报表':^50}")
    print("=" * 50)

    for product, amount in sales_data.items():
        percentage = amount / total_sales * 100
        print(f"{product:<15} {amount:>10,.2f} ({percentage:5.1f}%)")

    print("-" * 50)
    print(f"{'总计':<15} {total_sales:>10,.2f} (100.0%)")
    print("=" * 50)

# 测试数据
sales = {
    "iPhone": 1234567.89,
    "iPad": 987654.32,
    "MacBook": 2345678.90,
    "Apple Watch": 567890.12
}

generate_sales_report(sales)

# 实际场景：日志格式化
import datetime

def log_message(level, message, user_id=None):
    """格式化日志消息"""
    timestamp = datetime.datetime.now()

    if user_id:
        return f"[{timestamp:%Y-%m-%d %H:%M:%S}] {level:>5} | 用户{user_id:>6} | {message}"
    else:
        return f"[{timestamp:%Y-%m-%d %H:%M:%S}] {level:>5} | {'系统':>6} | {message}"

# 测试日志
print(log_message("INFO", "用户登录成功", 12345))
print(log_message("ERROR", "数据库连接失败"))
print(log_message("DEBUG", "处理请求", 67890))
```

**格式化方法的选择指南**

```python
# 什么时候用哪种格式化方法？

# 1. 简单的变量插入 → f-string
name = "Alice"
age = 25
simple = f"Hello, {name}! You are {age} years old."

# 2. 需要复杂格式化 → f-string
price = 1234.567
formatted_price = f"价格：¥{price:,.2f}"

# 3. 模板字符串（格式固定，数据变化） → str.format()
template = "用户 {name} 在 {date} 执行了 {action}"
log1 = template.format(name="Alice", date="2024-01-01", action="登录")
log2 = template.format(name="Bob", date="2024-01-02", action="注销")

# 4. 国际化需求 → str.format()（更容易提取模板）
# 因为 f-string 中的变量名不容易提取和翻译

# 5. 避免使用 % 格式化（除非维护老代码）
```

**字符串方法：文本处理的瑞士军刀**

Python 字符串提供了丰富的方法来处理文本，这些方法就像一把瑞士军刀，每个工具都有其特定的用途。让我们深入探索这些强大的工具。

**大小写转换：不只是改变外观**

大小写转换看似简单，但在实际应用中有很多细节和陷阱：

```python
# 基本的大小写转换
text = "  Hello World  "
sample = "Python Programming"

print(f"原文：'{text}'")
print(f"全大写：'{text.upper()}'")      # "  HELLO WORLD  "
print(f"全小写：'{text.lower()}'")      # "  hello world  "
print(f"标题格式：'{text.title()}'")     # "  Hello World  "
print(f"首字母大写：'{sample.capitalize()}'")  # "Python programming"
print(f"交换大小写：'{sample.swapcase()}'")    # "pYTHON pROGRAMMING"

# 但是要注意一些特殊情况
tricky_cases = [
    "mcdonald's",      # 所有格
    "o'connor",        # 爱尔兰姓氏
    "jean-claude",     # 连字符名字
    "iPhone",          # 品牌名
    "iOS开发",         # 混合语言
]

print("\n标题格式的陷阱：")
for case in tricky_cases:
    print(f"原文：{case:15} → title()：{case.title()}")

# 实际应用：安全的大小写比较
def safe_compare(str1, str2):
    """忽略大小写的字符串比较"""
    return str1.lower() == str2.lower()

# 测试
user_input = "PYTHON"
expected = "python"
print(f"\n忽略大小写比较：{safe_compare(user_input, expected)}")

# 实际应用：用户名标准化
def normalize_username(username):
    """标准化用户名：去除空白，转小写"""
    return username.strip().lower()

usernames = ["  Alice  ", "BOB", "Charlie\n", "DAVID\t"]
normalized = [normalize_username(name) for name in usernames]
print(f"标准化前：{usernames}")
print(f"标准化后：{normalized}")
```

**空白处理：看不见但很重要的字符**

空白字符在文本处理中经常被忽视，但它们可能导致很多问题：

```python
# 基本的空白处理
text = "  Hello World  "
print(f"原文：'{text}'")
print(f"去除两端空白：'{text.strip()}'")     # "Hello World"
print(f"去除左侧空白：'{text.lstrip()}'")    # "Hello World  "
print(f"去除右侧空白：'{text.rstrip()}'")    # "  Hello World"

# 不同类型的空白字符
whitespace_demo = "\t\n  Hello\r\n World  \t\n"
print(f"复杂空白：'{whitespace_demo}'")
print(f"清理后：'{whitespace_demo.strip()}'")

# 去除指定字符（不只是空白）
messy = "...Hello World!!!"
print(f"去除点号：'{messy.strip('.')}'")     # "Hello World!!!"
print(f"去除点号和感叹号：'{messy.strip('.!')}'")  # "Hello World"

# 实际应用：清理用户输入
def clean_user_input(user_input):
    """清理用户输入：去除空白和常见的无用字符"""
    if not user_input:
        return ""

    # 去除两端空白和常见的无用字符
    cleaned = user_input.strip(" \t\n\r.,;!?")

    # 将多个连续空白替换为单个空格
    import re
    cleaned = re.sub(r'\s+', ' ', cleaned)

    return cleaned

# 测试用户输入清理
test_inputs = [
    "  hello world  ",
    "\t\nPython\r\n",
    "...Alice!!!",
    "Bob   has    many    spaces",
    "",
    None
]

print("\n用户输入清理：")
for inp in test_inputs:
    try:
        cleaned = clean_user_input(inp)
        print(f"原始：{repr(inp):20} → 清理后：{repr(cleaned)}")
    except Exception as e:
        print(f"原始：{repr(inp):20} → 错误：{e}")
```

**查找和检查：文本中的侦探工作**

在文本中查找信息是编程中的常见任务，Python 提供了多种方法：

```python
sentence = "Python is awesome and Python is powerful"

# 基本查找
print(f"原句：{sentence}")
print(f"'Python' 第一次出现位置：{sentence.find('Python')}")  # 0
print(f"'Python' 最后一次出现位置：{sentence.rfind('Python')}")  # 23
print(f"'Java' 的位置：{sentence.find('Java')}")  # -1（未找到）

# find() vs index() 的区别
try:
    pos1 = sentence.find('Java')      # 返回 -1
    pos2 = sentence.index('Java')     # 抛出异常
except ValueError as e:
    print(f"index() 找不到时会抛出异常：{e}")

print(f"find() 找不到时返回：{pos1}")

# 计数功能
print(f"'Python' 出现次数：{sentence.count('Python')}")  # 2
print(f"'is' 出现次数：{sentence.count('is')}")  # 2
print(f"字母 'o' 出现次数：{sentence.count('o')}")

# 检查开头和结尾
files = ["document.pdf", "image.jpg", "script.py", "README.md"]
print("\n文件类型检查：")
for filename in files:
    if filename.endswith('.pdf'):
        print(f"{filename} 是 PDF 文件")
    elif filename.endswith(('.jpg', '.png', '.gif')):
        print(f"{filename} 是图片文件")
    elif filename.endswith('.py'):
        print(f"{filename} 是 Python 文件")
    else:
        print(f"{filename} 是其他类型文件")

# 字符串内容检查
test_strings = [
    "123",           # 纯数字
    "abc",           # 纯字母
    "abc123",        # 字母数字
    "   ",           # 纯空白
    "Hello World",   # 标题格式
    "HELLO",         # 全大写
    "hello",         # 全小写
    "",              # 空字符串
]

print("\n字符串内容分析：")
for s in test_strings:
    checks = {
        'isdigit': s.isdigit(),      # 全为数字
        'isalpha': s.isalpha(),      # 全为字母
        'isalnum': s.isalnum(),      # 字母或数字
        'isspace': s.isspace(),      # 全为空白
        'istitle': s.istitle(),      # 标题格式
        'isupper': s.isupper(),      # 全大写
        'islower': s.islower(),      # 全小写
    }

    true_checks = [k for k, v in checks.items() if v]
    print(f"'{s:12}' → {true_checks}")

# 实际应用：验证用户输入
def validate_password(password):
    """验证密码强度"""
    if len(password) < 8:
        return False, "密码长度至少8位"

    if not any(c.isupper() for c in password):
        return False, "密码必须包含大写字母"

    if not any(c.islower() for c in password):
        return False, "密码必须包含小写字母"

    if not any(c.isdigit() for c in password):
        return False, "密码必须包含数字"

    special_chars = "!@#$%^&*"
    if not any(c in special_chars for c in password):
        return False, "密码必须包含特殊字符"

    return True, "密码强度合格"

# 测试密码验证
test_passwords = [
    "123456",
    "password",
    "Password",
    "Password123",
    "Password123!",
]

print("\n密码强度验证：")
for pwd in test_passwords:
    valid, message = validate_password(pwd)
    status = "✓" if valid else "✗"
    print(f"{status} {pwd:15} → {message}")
```

**字符串替换：文本变换的艺术**

字符串替换是文本处理中的核心操作，从简单的单词替换到复杂的字符映射，Python 提供了多种强大的工具：

```python
# 基本替换
text = "I love Java programming"
print(f"原文：{text}")
print(f"替换后：{text.replace('Java', 'Python')}")  # "I love Python programming"

# 限制替换次数 - 很有用的功能
text = "apple apple apple banana apple"
print(f"原文：{text}")
print(f"替换前2个apple：{text.replace('apple', 'orange', 2)}")  # "orange orange apple banana apple"

# 替换的一些陷阱
tricky_text = "I love JavaScript and Java"
naive_replace = tricky_text.replace("Java", "Python")
print(f"天真的替换：{naive_replace}")  # "I love PythonScript and Python" - 出问题了！

# 更精确的替换需要正则表达式
import re
smart_replace = re.sub(r'\bJava\b', 'Python', tricky_text)  # \b 表示单词边界
print(f"智能替换：{smart_replace}")  # "I love JavaScript and Python"

# 字符映射：translate() 方法
# 这是一个非常高效的字符级替换方法
translation_table = str.maketrans("aeiou", "12345")
text = "hello world"
translated = text.translate(translation_table)
print(f"字符映射：{text} → {translated}")  # "h2ll4 w4rld"

# 更复杂的字符映射
def create_cipher(shift=3):
    """创建凯撒密码映射表"""
    alphabet = "abcdefghijklmnopqrstuvwxyz"
    shifted = alphabet[shift:] + alphabet[:shift]
    return str.maketrans(alphabet + alphabet.upper(),
                        shifted + shifted.upper())

cipher_table = create_cipher(3)
secret_message = "Hello World"
encrypted = secret_message.translate(cipher_table)
print(f"加密：{secret_message} → {encrypted}")

# 解密（反向移位）
decrypt_table = create_cipher(-3)
decrypted = encrypted.translate(decrypt_table)
print(f"解密：{encrypted} → {decrypted}")

# 实际应用：清理文本中的特殊字符
def clean_text_for_filename(text):
    """清理文本，使其适合作为文件名"""
    # 定义不允许的字符和它们的替换
    forbidden_chars = '<>:"/\\|?*'
    replacement_chars = '()_______'

    # 创建映射表
    trans_table = str.maketrans(forbidden_chars, replacement_chars)

    # 应用映射
    cleaned = text.translate(trans_table)

    # 去除多余的空格和点
    cleaned = cleaned.strip('. ')

    return cleaned

# 测试文件名清理
test_filenames = [
    "我的文档.txt",
    "项目/计划.docx",
    "数据<2024>.xlsx",
    "报告:最终版本.pdf",
    "备份\\文件.zip"
]

print("\n文件名清理：")
for filename in test_filenames:
    cleaned = clean_text_for_filename(filename)
    print(f"{filename:20} → {cleaned}")
```

**分割和连接：文本的拆解与重组**

分割和连接是文本处理中的基本操作，就像乐高积木的拆解和组装。掌握这些技巧能让你轻松处理各种文本格式：

```python
# 基本分割操作
fruits = "apple,banana,orange,grape"
fruit_list = fruits.split(",")
print(f"CSV分割：{fruits} → {fruit_list}")

# 按行分割 - 处理多行文本的利器
multiline_text = """第一行内容
第二行内容
第三行内容"""

lines = multiline_text.splitlines()
print(f"按行分割：{lines}")

# split() vs splitlines() 的区别
text_with_newlines = "line1\nline2\nline3\n"
print(f"split('\\n')：{text_with_newlines.split(chr(10))}")  # 最后有空字符串
print(f"splitlines()：{text_with_newlines.splitlines()}")   # 没有空字符串

# 限制分割次数 - 控制分割的精度
url = "https://www.example.com/path/to/resource"
parts = url.split("/", 3)  # 最多分割3次
print(f"URL分割：{parts}")  # ['https:', '', 'www.example.com', 'path/to/resource']

# 从右边分割
email = "user.name@company.example.com"
username, domain = email.rsplit("@", 1)  # 从右边分割，只分割1次
print(f"邮箱分割：用户名={username}, 域名={domain}")

# 按空白分割的智能行为
messy_sentence = "Python   is    really    awesome"
words = messy_sentence.split()  # 自动处理多个空格
print(f"智能空白分割：{words}")

# 分割的实际应用：解析配置文件
config_text = """
# 这是配置文件
database_host=localhost
database_port=5432
database_name=myapp
# 注释行
debug=true
"""

def parse_config(config_text):
    """解析简单的配置文件"""
    config = {}
    for line in config_text.splitlines():
        line = line.strip()
        # 跳过空行和注释
        if not line or line.startswith('#'):
            continue

        # 分割键值对
        if '=' in line:
            key, value = line.split('=', 1)  # 只分割第一个等号
            config[key.strip()] = value.strip()

    return config

config = parse_config(config_text)
print(f"解析的配置：{config}")

# 连接字符串 - 比 + 操作更高效
words = ["Python", "is", "awesome"]
sentence = " ".join(words)
print(f"基本连接：{sentence}")

# 不同分隔符的连接
numbers = ["1", "2", "3", "4", "5"]
print(f"逗号连接：{', '.join(numbers)}")
print(f"箭头连接：{' → '.join(numbers)}")
print(f"换行连接：\n{chr(10).join(numbers)}")

# 连接的实际应用：生成SQL查询
def build_insert_query(table, data):
    """构建INSERT SQL查询"""
    columns = list(data.keys())
    values = [f"'{v}'" for v in data.values()]

    columns_str = ", ".join(columns)
    values_str = ", ".join(values)

    return f"INSERT INTO {table} ({columns_str}) VALUES ({values_str})"

user_data = {
    "name": "Alice",
    "age": "25",
    "email": "alice@example.com"
}

sql = build_insert_query("users", user_data)
print(f"生成的SQL：{sql}")

# 高级应用：处理CSV数据
csv_data = """name,age,city
Alice,25,北京
Bob,30,上海
Charlie,35,广州"""

def parse_csv(csv_text):
    """简单的CSV解析器"""
    lines = csv_text.strip().splitlines()
    headers = lines[0].split(',')

    data = []
    for line in lines[1:]:
        values = line.split(',')
        row = dict(zip(headers, values))
        data.append(row)

    return data

csv_parsed = parse_csv(csv_data)
print("解析的CSV数据：")
for row in csv_parsed:
    print(f"  {row}")

# 连接时的性能考虑
import time

def inefficient_join(items):
    """低效的连接方式"""
    result = ""
    for item in items:
        result += item + " "
    return result.strip()

def efficient_join(items):
    """高效的连接方式"""
    return " ".join(items)

# 性能测试
large_list = [f"item{i}" for i in range(1000)]

start = time.time()
result1 = inefficient_join(large_list)
time1 = time.time() - start

start = time.time()
result2 = efficient_join(large_list)
time2 = time.time() - start

print(f"低效方式耗时：{time1:.4f}秒")
print(f"高效方式耗时：{time2:.4f}秒")
print(f"性能提升：{time1/time2:.1f}倍")
```

**字符串索引和切片：精确访问文本的每一部分**

字符串索引和切片是 Python 中最优雅的特性之一，它让我们能够像外科医生一样精确地操作文本。让我们深入理解这个强大的工具。

**索引：给每个字符一个地址**

```python
text = "Python Programming"
print(f"字符串：'{text}'")
print(f"长度：{len(text)} 个字符")

# 正向索引（从0开始）
print(f"第1个字符（索引0）：'{text[0]}'")   # 'P'
print(f"第2个字符（索引1）：'{text[1]}'")   # 'y'
print(f"第7个字符（索引6）：'{text[6]}'")   # ' '（空格）

# 负向索引（从-1开始）
print(f"最后1个字符（索引-1）：'{text[-1]}'")   # 'g'
print(f"最后2个字符（索引-2）：'{text[-2]}'")   # 'n'
print(f"最后7个字符（索引-7）：'{text[-7]}'")   # 'g'

# 索引的可视化理解
print("\n索引可视化：")
print("正向索引：", end="")
for i in range(len(text)):
    print(f"{i:2}", end="")
print()
print("字符内容：", end="")
for char in text:
    print(f"{char:2}", end="")
print()
print("负向索引：", end="")
for i in range(-len(text), 0):
    print(f"{i:2}", end="")
print()

# 索引越界的处理
try:
    char = text[100]  # 超出范围
except IndexError as e:
    print(f"索引越界错误：{e}")
```

**切片：文本的精确提取**

切片是 Python 最强大的特性之一，语法是 `[start:end:step]`：

```python
text = "Python Programming"

# === 基本切片 ===
print(f"原字符串：'{text}'")
print(f"前6个字符：'{text[0:6]}'")      # 'Python'
print(f"前6个字符（简写）：'{text[:6]}'")    # 'Python'
print(f"从第7个到结尾：'{text[7:]}'")     # 'Programming'
print(f"中间部分：'{text[7:11]}'")       # 'Prog'
print(f"完整复制：'{text[:]}'")          # 'Python Programming'

# === 负数索引切片 ===
print(f"最后4个字符：'{text[-4:]}'")      # 'ming'
print(f"除了最后3个：'{text[:-3]}'")      # 'Python Program'
print(f"中间部分（负索引）：'{text[-11:-7]}'")  # 'Prog'

# === 步长切片 ===
print(f"每隔一个字符：'{text[::2]}'")      # 'Pto rgamn'
print(f"每隔两个字符：'{text[::3]}'")      # 'Ph oamn'
print(f"反转字符串：'{text[::-1]}'")       # 'gnimmargorP nohtyP'
print(f"倒着每隔一个：'{text[::-2]}'")     # 'gimrgrPnhy'

# 切片的边界行为
print(f"超出范围的切片：'{text[100:200]}'")  # 返回空字符串，不报错
print(f"起始超出范围：'{text[100:]}'")      # 返回空字符串
print(f"结束超出范围：'{text[:100]}'")      # 返回完整字符串

# 实际应用示例
def extract_file_info(filepath):
    """从文件路径中提取信息"""
    # 找到最后一个斜杠的位置
    last_slash = filepath.rfind('/')
    if last_slash == -1:
        filename = filepath
        directory = ""
    else:
        directory = filepath[:last_slash]
        filename = filepath[last_slash + 1:]

    # 分离文件名和扩展名
    last_dot = filename.rfind('.')
    if last_dot == -1:
        name = filename
        extension = ""
    else:
        name = filename[:last_dot]
        extension = filename[last_dot + 1:]

    return {
        'directory': directory,
        'filename': filename,
        'name': name,
        'extension': extension
    }

# 测试文件路径解析
test_paths = [
    "/home/user/documents/report.pdf",
    "image.jpg",
    "/var/log/system",
    "C:\\Users\\Alice\\Desktop\\presentation.pptx"
]

print("\n文件路径解析：")
for path in test_paths:
    info = extract_file_info(path)
    print(f"路径：{path}")
    print(f"  目录：{info['directory']}")
    print(f"  文件名：{info['filename']}")
    print(f"  名称：{info['name']}")
    print(f"  扩展名：{info['extension']}")
    print()

# 切片的高级应用：文本处理
def mask_sensitive_info(text, mask_char='*'):
    """遮蔽敏感信息"""
    if len(text) <= 4:
        return mask_char * len(text)

    # 保留前2位和后2位，中间用*替代
    return text[:2] + mask_char * (len(text) - 4) + text[-2:]

# 测试敏感信息遮蔽
sensitive_data = [
    "13812345678",      # 手机号
    "6222021234567890", # 银行卡号
    "alice@example.com", # 邮箱
    "AB123456",         # 身份证号（简化）
]

print("敏感信息遮蔽：")
for data in sensitive_data:
    masked = mask_sensitive_info(data)
    print(f"{data:20} → {masked}")

# 字符串切片的性能特性
def demonstrate_slice_performance():
    """演示切片的性能特性"""
    large_text = "A" * 1000000  # 100万个字符

    import time

    # 切片操作
    start = time.time()
    substring = large_text[100:200]  # 只取100个字符
    slice_time = time.time() - start

    print(f"从100万字符中切片100个字符耗时：{slice_time:.6f}秒")
    print(f"切片结果长度：{len(substring)}")

    # 切片创建新对象
    print(f"原字符串ID：{id(large_text)}")
    print(f"切片字符串ID：{id(substring)}")
    print(f"是同一个对象吗？{large_text is substring}")

demonstrate_slice_performance()
```

**字符串编码：跨越语言和文化的桥梁**

在全球化的今天，程序需要处理世界各地的文字。字符串编码是连接不同语言文字与计算机内部表示的桥梁。让我们深入理解这个重要概念。

**Unicode：统一全世界文字的伟大尝试**

```python
# Unicode 让我们可以在同一个字符串中使用多种语言
multilingual = "Hello 你好 こんにちは مرحبا Здравствуйте 🌍"
print(f"多语言字符串：{multilingual}")

# 每种文字都有自己的 Unicode 范围
examples = {
    'A': '拉丁字母',
    '中': '中日韩统一表意文字',
    'あ': '日文平假名',
    'α': '希腊字母',
    '🐍': '表情符号',
    '𝕏': '数学字母数字符号'
}

print("\nUnicode 字符示例：")
for char, description in examples.items():
    print(f"字符 '{char}': U+{ord(char):04X} ({ord(char)}) - {description}")

# Unicode 的版本演进
def analyze_unicode_char(char):
    """分析 Unicode 字符的详细信息"""
    code_point = ord(char)

    # 判断字符类型
    if 0x0000 <= code_point <= 0x007F:
        char_type = "ASCII"
    elif 0x4E00 <= code_point <= 0x9FFF:
        char_type = "中日韩统一表意文字"
    elif 0x3040 <= code_point <= 0x309F:
        char_type = "日文平假名"
    elif 0x30A0 <= code_point <= 0x30FF:
        char_type = "日文片假名"
    elif 0x1F600 <= code_point <= 0x1F64F:
        char_type = "表情符号"
    else:
        char_type = "其他"

    return {
        'char': char,
        'code_point': code_point,
        'hex': f"U+{code_point:04X}",
        'type': char_type
    }

test_chars = "A中あアα🐍"
print("\n字符分析：")
for char in test_chars:
    info = analyze_unicode_char(char)
    print(f"{info['char']} → {info['hex']} ({info['code_point']}) - {info['type']}")
```

**编码和解码：字符串与字节的转换**

```python
# 字符串编码：从人类可读到机器存储
text = "Hello, 世界! 🌍"
print(f"原始字符串：{text}")

# 不同编码方式的比较
encodings = ['utf-8', 'utf-16', 'utf-32', 'gbk']
print("\n不同编码方式的字节表示：")

for encoding in encodings:
    try:
        encoded = text.encode(encoding)
        print(f"{encoding:8}: {len(encoded):2} 字节 - {encoded[:20]}...")
    except UnicodeEncodeError as e:
        print(f"{encoding:8}: 编码失败 - {e}")

# UTF-8 的变长编码特性
def analyze_utf8_encoding(text):
    """分析 UTF-8 编码的字节使用"""
    print(f"\nUTF-8 编码分析：'{text}'")
    encoded = text.encode('utf-8')

    char_index = 0
    byte_index = 0

    for char in text:
        char_bytes = char.encode('utf-8')
        byte_count = len(char_bytes)

        print(f"字符 '{char}': {byte_count} 字节 - {char_bytes}")
        byte_index += byte_count

utf8_examples = ["A", "中", "🐍"]
for example in utf8_examples:
    analyze_utf8_encoding(example)

# 编码错误处理
problematic_text = "Hello, 世界!"

print("\n编码错误处理策略：")
# 尝试用不支持中文的编码
try:
    encoded = problematic_text.encode('ascii')
except UnicodeEncodeError as e:
    print(f"ASCII编码失败：{e}")

    # 不同的错误处理策略
    strategies = {
        'ignore': problematic_text.encode('ascii', errors='ignore'),
        'replace': problematic_text.encode('ascii', errors='replace'),
        'xmlcharrefreplace': problematic_text.encode('ascii', errors='xmlcharrefreplace'),
    }

    for strategy, result in strategies.items():
        decoded = result.decode('ascii')
        print(f"{strategy:15}: {result} → '{decoded}'")

# 解码错误处理
invalid_bytes = b'\xff\xfe\x00\x48\x00\x65\x00\x6c\x00\x6c\x00\x6f'

print("\n解码错误处理：")
decode_strategies = ['strict', 'ignore', 'replace', 'backslashreplace']

for strategy in decode_strategies:
    try:
        result = invalid_bytes.decode('utf-8', errors=strategy)
        print(f"{strategy:15}: '{result}'")
    except UnicodeDecodeError as e:
        print(f"{strategy:15}: 解码失败 - {e}")

# 实际应用：文件编码检测和转换
def detect_and_convert_encoding(file_content_bytes):
    """检测文件编码并转换为UTF-8"""
    # 常见编码列表
    common_encodings = ['utf-8', 'gbk', 'gb2312', 'big5', 'utf-16', 'latin1']

    for encoding in common_encodings:
        try:
            decoded_text = file_content_bytes.decode(encoding)
            print(f"成功用 {encoding} 解码")

            # 转换为 UTF-8
            utf8_bytes = decoded_text.encode('utf-8')
            return decoded_text, utf8_bytes

        except UnicodeDecodeError:
            continue

    print("无法检测编码")
    return None, None

# 模拟不同编码的文件内容
test_content = "这是一个测试文件，包含中文内容。"
gbk_bytes = test_content.encode('gbk')
utf16_bytes = test_content.encode('utf-16')

print("\n编码检测测试：")
print("GBK编码的内容：")
text, utf8_bytes = detect_and_convert_encoding(gbk_bytes)

print("UTF-16编码的内容：")
text, utf8_bytes = detect_and_convert_encoding(utf16_bytes)
```

**字符和码点的转换**

```python
# ord() 和 chr() 函数：字符与码点的桥梁
print("字符与码点转换：")

# 基本转换
examples = ['A', 'a', '0', '中', '🐍', '♠']
for char in examples:
    code_point = ord(char)
    back_to_char = chr(code_point)
    print(f"'{char}' ↔ {code_point} ↔ '{back_to_char}'")

# 生成字符序列
def generate_char_sequence(start_char, count):
    """生成字符序列"""
    start_code = ord(start_char)
    return [chr(start_code + i) for i in range(count)]

# 生成字母序列
letters = generate_char_sequence('A', 26)
print(f"\n大写字母：{''.join(letters)}")

numbers = generate_char_sequence('0', 10)
print(f"数字字符：{''.join(numbers)}")

# 中文字符范围示例
chinese_chars = generate_char_sequence('一', 10)
print(f"中文字符：{''.join(chinese_chars)}")

# 实际应用：密码强度检查
def check_password_strength(password):
    """检查密码强度"""
    strength = {
        'has_lower': any(c.islower() for c in password),
        'has_upper': any(c.isupper() for c in password),
        'has_digit': any(c.isdigit() for c in password),
        'has_special': any(not c.isalnum() for c in password),
        'length_ok': len(password) >= 8
    }

    score = sum(strength.values())

    if score == 5:
        level = "强"
    elif score >= 3:
        level = "中"
    else:
        level = "弱"

    return level, strength

# 测试密码强度
test_passwords = [
    "123456",
    "password",
    "Password123",
    "P@ssw0rd!",
    "我的密码123!"
]

print("\n密码强度检查：")
for pwd in test_passwords:
    level, details = check_password_strength(pwd)
    print(f"'{pwd:15}' → 强度: {level}")
    for key, value in details.items():
        status = "✓" if value else "✗"
        print(f"  {status} {key}")
    print()
```

**字符串的实用技巧：高级应用和最佳实践**

掌握了基础知识后，让我们探索一些高级技巧和实际应用场景，这些技巧能让你的代码更加优雅和高效。

**字符串模板：安全的动态文本生成**

```python
from string import Template

# 基本模板使用
template = Template("Hello, $name! You have $count messages.")
result = template.substitute(name="Alice", count=5)
print(f"基本模板：{result}")

# 安全替换：不会因为缺少变量而报错
partial_result = template.safe_substitute(name="Bob")
print(f"安全替换：{partial_result}")  # "Hello, Bob! You have $count messages."

# 模板的实际应用：邮件生成
email_template = Template("""
亲爱的 $customer_name，

感谢您购买我们的产品！

订单详情：
- 订单号：$order_id
- 商品：$product_name
- 数量：$quantity
- 总价：￥$total_price

预计 $delivery_days 天内送达。

祝您购物愉快！
$company_name
""")

order_data = {
    'customer_name': '张三',
    'order_id': 'ORD20240101001',
    'product_name': 'Python编程书籍',
    'quantity': 2,
    'total_price': 158.00,
    'delivery_days': 3,
    'company_name': '技术书店'
}

email_content = email_template.substitute(**order_data)
print("生成的邮件：")
print(email_content)

# 模板的安全性：防止注入攻击
def safe_template_render(template_str, data):
    """安全的模板渲染"""
    try:
        template = Template(template_str)
        return template.safe_substitute(**data)
    except Exception as e:
        return f"模板渲染错误：{e}"

# 测试安全性
unsafe_data = {
    'name': 'Alice',
    'malicious': '${__import__("os").system("echo hacked")}'
}

safe_result = safe_template_render("Hello $name, $malicious", unsafe_data)
print(f"安全渲染结果：{safe_result}")
```

**字符串对齐和格式化：美化输出**

```python
# 基本对齐方法
text = "Python"
print("基本对齐方法：")
print(f"左对齐：'{text.ljust(15, '.')}'")   # 'Python.........'
print(f"右对齐：'{text.rjust(15, '.')}'")   # '.........Python'
print(f"居中：'{text.center(15, '.')}'")    # '....Python.....'

# 数字填充
numbers = [42, 7, 1234, 56789]
print("\n数字填充：")
for num in numbers:
    num_str = str(num)
    print(f"原数字：{num:5} → 填充零：{num_str.zfill(8)}")

# 实际应用：生成格式化报表
def generate_sales_table(sales_data):
    """生成格式化的销售报表"""
    # 表头
    headers = ["商品名称", "销售数量", "单价", "总金额"]
    col_widths = [15, 10, 10, 12]

    # 打印表头
    header_line = " | ".join(
        header.center(width) for header, width in zip(headers, col_widths)
    )
    print(header_line)
    print("-" * len(header_line))

    # 打印数据行
    total_amount = 0
    for item in sales_data:
        name = item['name'][:14]  # 截断过长的名称
        quantity = str(item['quantity'])
        price = f"¥{item['price']:.2f}"
        amount = item['quantity'] * item['price']
        amount_str = f"¥{amount:.2f}"

        row = " | ".join([
            name.ljust(col_widths[0]),
            quantity.rjust(col_widths[1]),
            price.rjust(col_widths[2]),
            amount_str.rjust(col_widths[3])
        ])
        print(row)
        total_amount += amount

    # 打印总计
    print("-" * len(header_line))
    total_row = " | ".join([
        "总计".ljust(col_widths[0]),
        "".rjust(col_widths[1]),
        "".rjust(col_widths[2]),
        f"¥{total_amount:.2f}".rjust(col_widths[3])
    ])
    print(total_row)

# 测试销售报表
sales_data = [
    {'name': 'Python编程书', 'quantity': 10, 'price': 89.90},
    {'name': 'JavaScript权威指南', 'quantity': 5, 'price': 128.00},
    {'name': '算法导论', 'quantity': 3, 'price': 158.50},
    {'name': '深度学习', 'quantity': 8, 'price': 99.80},
]

print("\n销售报表：")
generate_sales_table(sales_data)
```

**高级字符串检查和验证**

```python
# 复合条件检查
def analyze_string_composition(text):
    """分析字符串的组成"""
    if not text:
        return "空字符串"

    composition = {
        '数字': sum(1 for c in text if c.isdigit()),
        '字母': sum(1 for c in text if c.isalpha()),
        '大写字母': sum(1 for c in text if c.isupper()),
        '小写字母': sum(1 for c in text if c.islower()),
        '空白字符': sum(1 for c in text if c.isspace()),
        '特殊字符': sum(1 for c in text if not c.isalnum() and not c.isspace()),
        '中文字符': sum(1 for c in text if '\u4e00' <= c <= '\u9fff'),
    }

    return composition

# 测试字符串组成分析
test_strings = [
    "Hello123!",
    "你好世界",
    "Password@123",
    "   spaces   ",
    "MixedCase",
    "纯中文测试",
    "Mixed中英文123!",
]

print("字符串组成分析：")
for text in test_strings:
    composition = analyze_string_composition(text)
    print(f"'{text:15}' → {composition}")

# 实际应用：智能密码强度评估
def advanced_password_strength(password):
    """高级密码强度评估"""
    if len(password) < 6:
        return "太短", 0

    score = 0
    feedback = []

    # 长度评分
    if len(password) >= 8:
        score += 2
    elif len(password) >= 6:
        score += 1
    else:
        feedback.append("密码太短")

    # 字符类型评分
    has_lower = any(c.islower() for c in password)
    has_upper = any(c.isupper() for c in password)
    has_digit = any(c.isdigit() for c in password)
    has_special = any(not c.isalnum() for c in password)

    char_types = sum([has_lower, has_upper, has_digit, has_special])
    score += char_types

    if not has_lower:
        feedback.append("缺少小写字母")
    if not has_upper:
        feedback.append("缺少大写字母")
    if not has_digit:
        feedback.append("缺少数字")
    if not has_special:
        feedback.append("缺少特殊字符")

    # 复杂度评分
    unique_chars = len(set(password))
    if unique_chars >= len(password) * 0.8:
        score += 1
    else:
        feedback.append("重复字符过多")

    # 常见模式检查
    common_patterns = ['123', 'abc', 'password', 'qwerty']
    if any(pattern in password.lower() for pattern in common_patterns):
        score -= 2
        feedback.append("包含常见模式")

    # 评级
    if score >= 7:
        strength = "很强"
    elif score >= 5:
        strength = "强"
    elif score >= 3:
        strength = "中等"
    else:
        strength = "弱"

    return strength, score, feedback

# 测试高级密码强度
test_passwords = [
    "123456",
    "password",
    "Password123",
    "P@ssw0rd!2024",
    "MyVerySecureP@ssw0rd!",
    "abc123ABC!@#",
]

print("\n高级密码强度评估：")
for pwd in test_passwords:
    strength, score, feedback = advanced_password_strength(pwd)
    print(f"密码：{pwd:20}")
    print(f"  强度：{strength} (得分：{score})")
    if feedback:
        print(f"  建议：{', '.join(feedback)}")
    print()
```

**现代 Python 字符串特性**

```python
# Python 3.9+ 的新特性
def demonstrate_modern_features():
    """演示现代 Python 字符串特性"""

    # removeprefix 和 removesuffix (Python 3.9+)
    if hasattr(str, 'removeprefix'):
        filename = "backup_data_2024.txt"

        # 移除前缀
        without_prefix = filename.removeprefix("backup_")
        print(f"移除前缀：{filename} → {without_prefix}")

        # 移除后缀
        without_suffix = filename.removesuffix(".txt")
        print(f"移除后缀：{filename} → {without_suffix}")

        # 链式操作
        clean_name = filename.removeprefix("backup_").removesuffix(".txt")
        print(f"链式操作：{filename} → {clean_name}")
    else:
        print("当前 Python 版本不支持 removeprefix/removesuffix")

    # 字符串的新格式化选项
    number = 1234567.89
    print(f"\n数字格式化新特性：")
    print(f"千位分隔符：{number:,}")
    print(f"下划线分隔符：{number:_}")
    print(f"科学计数法：{number:.2e}")

    # 字符串的 walrus 操作符应用 (Python 3.8+)
    text = "Python Programming"
    if (length := len(text)) > 10:
        print(f"长字符串：'{text}' (长度：{length})")

demonstrate_modern_features()

# 字符串性能优化技巧
def string_performance_tips():
    """字符串性能优化技巧"""
    import time

    # 技巧1：使用 join 而不是 += 进行大量拼接
    def test_concatenation_performance():
        n = 1000

        # 低效方式
        start = time.time()
        result = ""
        for i in range(n):
            result += f"item{i} "
        time1 = time.time() - start

        # 高效方式
        start = time.time()
        parts = []
        for i in range(n):
            parts.append(f"item{i} ")
        result = "".join(parts)
        time2 = time.time() - start

        print(f"拼接性能对比（{n}次）：")
        print(f"  += 方式：{time1:.4f}秒")
        print(f"  join方式：{time2:.4f}秒")
        print(f"  性能提升：{time1/time2:.1f}倍")

    test_concatenation_performance()

    # 技巧2：字符串缓存
    def demonstrate_string_interning():
        """演示字符串缓存"""
        # 小字符串会被自动缓存
        a = "hello"
        b = "hello"
        print(f"\n字符串缓存：")
        print(f"a is b: {a is b}")  # True

        # 大字符串或动态生成的字符串不会被缓存
        c = "hello" * 100
        d = "hello" * 100
        print(f"c is d: {c is d}")  # 可能是 False

        # 手动缓存
        import sys
        e = sys.intern("hello" * 100)
        f = sys.intern("hello" * 100)
        print(f"手动缓存后 e is f: {e is f}")  # True

    demonstrate_string_interning()

string_performance_tips()
```

## 总结：字符串掌握之路

通过这次深入的探索，我们不仅学会了 Python 字符串的语法，更重要的是理解了其背后的设计思想和实际应用。

**核心概念回顾：**

1. **字符串的本质**：Unicode 字符的不可变序列
2. **创建方式**：单引号、双引号、三引号、原始字符串，各有用途
3. **不可变性**：理解引用和对象的区别，掌握高效拼接技巧
4. **格式化进化**：从 % 到 format() 再到 f-string 的优雅演进
5. **方法宝库**：丰富的字符串方法，每个都有其特定场景
6. **索引切片**：Python 最优雅的特性之一，精确控制文本
7. **编码解码**：连接人类语言与计算机存储的桥梁

**实践智慧：**

- **选择合适的工具**：简单拼接用 f-string，大量拼接用 join()
- **注意性能陷阱**：避免循环中的字符串拼接
- **处理编码问题**：始终明确编码方式，优雅处理错误
- **验证用户输入**：使用字符串方法构建健壮的验证逻辑
- **格式化输出**：利用对齐和填充创建美观的文本界面

**编程哲学：**

- **可读性至上**：好的字符串处理代码应该像散文一样易读
- **防御性编程**：预期并处理各种边界情况
- **性能意识**：了解操作的时间复杂度，选择合适的算法
- **国际化思维**：考虑多语言支持，正确处理 Unicode

字符串处理是编程的基本功，也是艺术。掌握了这些知识，你就拥有了处理文本世界的强大武器。记住，优秀的程序员不仅要会写代码，更要会写出优雅、高效、可维护的代码。字符串操作正是展现这种能力的绝佳舞台。
