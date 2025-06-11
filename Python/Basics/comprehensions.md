# 推导式和实用技巧

推导式是 Python 的强大特性，让你能够简洁地创建和处理数据结构。

## 列表推导式

### 基本语法

```python
# === 基本语法：[表达式 for 项 in 可迭代对象 if 条件] ===

# 生成平方数
squares = [x**2 for x in range(10)]
print(f"平方数：{squares}")
# [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# 过滤偶数
numbers = range(20)
evens = [x for x in numbers if x % 2 == 0]
print(f"偶数：{evens}")
# [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]

# 字符串处理
words = ["hello", "world", "python", "programming"]
upper_words = [word.upper() for word in words]
print(f"大写单词：{upper_words}")
# ['HELLO', 'WORLD', 'PYTHON', 'PROGRAMMING']

# 长度过滤
long_words = [word for word in words if len(word) > 5]
print(f"长单词：{long_words}")
# ['python', 'programming']

# 复杂表达式
prices = [19.99, 25.50, 12.75, 8.99]
formatted_prices = [f"${price:.2f}" for price in prices]
print(f"格式化价格：{formatted_prices}")
# ['$19.99', '$25.50', '$12.75', '$8.99']
```

### 嵌套和复杂推导式

```python
# === 嵌套循环 ===
# 创建乘法表
multiplication_table = [[i*j for j in range(1, 4)] for i in range(1, 4)]
print(f"乘法表：{multiplication_table}")
# [[1, 2, 3], [2, 4, 6], [3, 6, 9]]

# 展平嵌套列表
nested = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flattened = [item for sublist in nested for item in sublist]
print(f"展平后：{flattened}")
# [1, 2, 3, 4, 5, 6, 7, 8, 9]

# 条件表达式
numbers = range(-5, 6)
abs_values = [x if x >= 0 else -x for x in numbers]
print(f"绝对值：{abs_values}")
# [5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5]

# 复杂条件
students = [
    {"name": "Alice", "score": 85},
    {"name": "Bob", "score": 92},
    {"name": "Charlie", "score": 78},
    {"name": "Diana", "score": 96}
]

high_achievers = [
    f"{student['name']}: {student['score']}" 
    for student in students 
    if student['score'] >= 90
]
print(f"高分学生：{high_achievers}")
# ['Bob: 92', 'Diana: 96']

# === 字符串和文本处理 ===
text = "Hello, World! How are you today?"
# 提取单词的首字母
initials = [word[0].upper() for word in text.split() if word.isalpha()]
print(f"首字母：{initials}")
# ['H', 'W', 'H', 'A', 'Y', 'T']

# 过滤和转换
sentences = ["This is good.", "This is bad!", "This is great?"]
clean_sentences = [
    sentence.replace(".", "").replace("!", "").replace("?", "")
    for sentence in sentences
    if "good" in sentence or "great" in sentence
]
print(f"清理后的句子：{clean_sentences}")
# ['This is good', 'This is great']
```

## 字典推导式

```python
# === 基本语法：{键表达式: 值表达式 for 项 in 可迭代对象 if 条件} ===

# 创建平方字典
squares_dict = {x: x**2 for x in range(5)}
print(f"平方字典：{squares_dict}")
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

# 过滤字典
scores = {"Alice": 85, "Bob": 92, "Charlie": 78, "Diana": 96}
high_scores = {name: score for name, score in scores.items() if score >= 90}
print(f"高分学生：{high_scores}")
# {'Bob': 92, 'Diana': 96}

# 转换值
celsius_temps = {"北京": 25, "上海": 28, "广州": 32}
fahrenheit_temps = {city: temp * 9/5 + 32 for city, temp in celsius_temps.items()}
print(f"华氏温度：{fahrenheit_temps}")
# {'北京': 77.0, '上海': 82.4, '广州': 89.6}

# 从列表创建字典
words = ["apple", "banana", "cherry"]
word_lengths = {word: len(word) for word in words}
print(f"单词长度：{word_lengths}")
# {'apple': 5, 'banana': 6, 'cherry': 6}

# 反转字典
original = {"a": 1, "b": 2, "c": 3}
reversed_dict = {value: key for key, value in original.items()}
print(f"反转字典：{reversed_dict}")
# {1: 'a', 2: 'b', 3: 'c'}

# === 复杂字典推导式 ===
# 分组数据
students = [
    {"name": "Alice", "grade": "A", "subject": "Math"},
    {"name": "Bob", "grade": "B", "subject": "Math"},
    {"name": "Charlie", "grade": "A", "subject": "Science"},
    {"name": "Diana", "grade": "B", "subject": "Science"}
]

# 按科目分组
subjects = {subject for student in students for subject in [student["subject"]]}
grouped_by_subject = {
    subject: [student["name"] for student in students if student["subject"] == subject]
    for subject in subjects
}
print(f"按科目分组：{grouped_by_subject}")
# {'Math': ['Alice', 'Bob'], 'Science': ['Charlie', 'Diana']}

# 统计字符频率
text = "hello world"
char_frequency = {char: text.count(char) for char in set(text) if char != ' '}
print(f"字符频率：{char_frequency}")
# {'h': 1, 'e': 1, 'l': 3, 'o': 2, 'w': 1, 'r': 1, 'd': 1}
```

## 集合推导式

```python
# === 基本语法：{表达式 for 项 in 可迭代对象 if 条件} ===

# 创建唯一长度集合
words = ["hello", "world", "python", "hello", "programming"]
unique_lengths = {len(word) for word in words}
print(f"唯一长度：{unique_lengths}")
# {5, 6, 11}

# 提取唯一字符
text = "programming"
unique_chars = {char.upper() for char in text}
print(f"唯一字符：{unique_chars}")
# {'P', 'R', 'O', 'G', 'A', 'M', 'I', 'N'}

# 数学集合操作
numbers1 = {x**2 for x in range(10) if x % 2 == 0}
numbers2 = {x**3 for x in range(5)}
print(f"平方数（偶数）：{numbers1}")  # {0, 4, 16, 36, 64}
print(f"立方数：{numbers2}")         # {0, 1, 8, 27, 64}
print(f"交集：{numbers1 & numbers2}")  # {0, 64}

# 过滤重复数据
data = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4]
unique_data = {x for x in data}
print(f"去重后：{unique_data}")  # {1, 2, 3, 4}

# 条件过滤
emails = ["user@gmail.com", "admin@company.com", "test@gmail.com", "info@company.com"]
gmail_domains = {email.split('@')[1] for email in emails if 'gmail' in email}
print(f"Gmail 域名：{gmail_domains}")  # {'gmail.com'}
```

## 生成器表达式

```python
# === 语法：(表达式 for 项 in 可迭代对象 if 条件) ===

# 内存高效的大数据处理
large_squares = (x**2 for x in range(1000000))  # 不会立即计算所有值
print(f"生成器对象：{large_squares}")

# 使用生成器
first_five = [next(large_squares) for _ in range(5)]
print(f"前5个平方数：{first_five}")  # [0, 1, 4, 9, 16]

# 生成器在函数中的使用
def process_large_data():
    # 模拟大数据处理
    data_generator = (x * 2 for x in range(1000000) if x % 1000 == 0)
    
    # 只处理前10个
    results = []
    for i, value in enumerate(data_generator):
        if i >= 10:
            break
        results.append(value)
    
    return results

processed = process_large_data()
print(f"处理结果：{processed}")

# === 生成器与内置函数 ===
# sum() 可以直接使用生成器
total = sum(x**2 for x in range(100) if x % 2 == 0)
print(f"偶数平方和：{total}")

# any() 和 all() 与生成器
numbers = [2, 4, 6, 8, 10]
all_even = all(x % 2 == 0 for x in numbers)
print(f"都是偶数：{all_even}")  # True

has_large = any(x > 100 for x in numbers)
print(f"有大于100的数：{has_large}")  # False

# max() 和 min() 与生成器
words = ["python", "java", "javascript", "go"]
longest_word = max((word for word in words), key=len)
print(f"最长单词：{longest_word}")  # javascript
```

## 实用的内置函数

```python
# === 数学和统计函数 ===
numbers = [1, 5, 3, 9, 2, 8, 4]
print(f"数字列表：{numbers}")
print(f"长度：{len(numbers)}")
print(f"最大值：{max(numbers)}")
print(f"最小值：{min(numbers)}")
print(f"总和：{sum(numbers)}")
print(f"排序：{sorted(numbers)}")
print(f"反向排序：{sorted(numbers, reverse=True)}")

# === 类型转换 ===
print(f"\n类型转换示例：")
print(f"int('123') = {int('123')}")
print(f"float('3.14') = {float('3.14')}")
print(f"str(42) = {str(42)}")
print(f"list('hello') = {list('hello')}")
print(f"tuple([1,2,3]) = {tuple([1,2,3])}")
print(f"set([1,2,2,3]) = {set([1,2,2,3])}")

# === 序列操作 ===
text = "Python"
print(f"\n序列操作：")
print(f"enumerate: {list(enumerate(text))}")
print(f"zip: {list(zip(text, range(len(text))))}")
print(f"reversed: {''.join(reversed(text))}")

# === 函数式编程 ===
numbers = [1, 2, 3, 4, 5]
print(f"\n函数式编程：")
print(f"map(平方): {list(map(lambda x: x**2, numbers))}")
print(f"filter(偶数): {list(filter(lambda x: x % 2 == 0, numbers))}")

# reduce 需要导入
from functools import reduce
print(f"reduce(乘积): {reduce(lambda x, y: x * y, numbers)}")

# === 实用函数 ===
print(f"\n实用函数：")
print(f"all([True, True, False]) = {all([True, True, False])}")
print(f"any([False, False, True]) = {any([False, False, True])}")
print(f"abs(-5) = {abs(-5)}")
print(f"round(3.14159, 2) = {round(3.14159, 2)}")
print(f"pow(2, 3) = {pow(2, 3)}")

# divmod：同时获取商和余数
quotient, remainder = divmod(17, 5)
print(f"divmod(17, 5) = {quotient}, {remainder}")

# === 字符串和 ASCII ===
print(f"\n字符和 ASCII：")
print(f"ord('A') = {ord('A')}")  # 字符转 ASCII
print(f"chr(65) = {chr(65)}")    # ASCII 转字符

# === 进制转换 ===
number = 42
print(f"\n进制转换：")
print(f"bin({number}) = {bin(number)}")  # 二进制
print(f"oct({number}) = {oct(number)}")  # 八进制
print(f"hex({number}) = {hex(number)}")  # 十六进制
```

## 高级技巧和模式

```python
# === 链式操作 ===
from itertools import chain

# 展平多个列表
lists = [[1, 2], [3, 4], [5, 6]]
flattened = list(chain.from_iterable(lists))
print(f"链式展平：{flattened}")  # [1, 2, 3, 4, 5, 6]

# === 分组和分区 ===
def partition(predicate, iterable):
    """根据条件分区"""
    true_items = [item for item in iterable if predicate(item)]
    false_items = [item for item in iterable if not predicate(item)]
    return true_items, false_items

numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
evens, odds = partition(lambda x: x % 2 == 0, numbers)
print(f"偶数：{evens}")  # [2, 4, 6, 8, 10]
print(f"奇数：{odds}")   # [1, 3, 5, 7, 9]

# === 数据转换管道 ===
def process_data_pipeline(data):
    """数据处理管道"""
    # 步骤1：过滤正数
    positive = [x for x in data if x > 0]
    
    # 步骤2：平方
    squared = [x**2 for x in positive]
    
    # 步骤3：过滤小于100的
    filtered = [x for x in squared if x < 100]
    
    # 步骤4：排序
    sorted_data = sorted(filtered)
    
    return sorted_data

raw_data = [-3, -1, 0, 1, 2, 3, 4, 5, 8, 10, 15]
result = process_data_pipeline(raw_data)
print(f"处理结果：{result}")  # [1, 4, 9, 16, 25, 64]

# === 一行式数据处理 ===
# 同样的处理，用一行完成
one_liner = sorted([x**2 for x in raw_data if x > 0 and x**2 < 100])
print(f"一行处理：{one_liner}")  # [1, 4, 9, 16, 25, 64]

# === 条件统计 ===
text = "Hello, World! How are you today?"
stats = {
    "letters": sum(1 for c in text if c.isalpha()),
    "digits": sum(1 for c in text if c.isdigit()),
    "spaces": sum(1 for c in text if c.isspace()),
    "punctuation": sum(1 for c in text if not c.isalnum() and not c.isspace())
}
print(f"文本统计：{stats}")

# === 嵌套数据处理 ===
data = [
    {"name": "Alice", "scores": [85, 92, 78]},
    {"name": "Bob", "scores": [88, 85, 90]},
    {"name": "Charlie", "scores": [92, 88, 85]}
]

# 计算每个学生的平均分
averages = {
    student["name"]: sum(student["scores"]) / len(student["scores"])
    for student in data
}
print(f"平均分：{averages}")

# 找出所有高于90分的成绩
high_scores = [
    score for student in data 
    for score in student["scores"] 
    if score > 90
]
print(f"高分成绩：{high_scores}")  # [92, 92]
```

## 性能考虑

```python
import time

# === 性能比较：推导式 vs 循环 ===
def time_comparison():
    n = 100000
    
    # 使用推导式
    start = time.time()
    squares_comp = [x**2 for x in range(n)]
    comp_time = time.time() - start
    
    # 使用传统循环
    start = time.time()
    squares_loop = []
    for x in range(n):
        squares_loop.append(x**2)
    loop_time = time.time() - start
    
    print(f"推导式时间：{comp_time:.4f}秒")
    print(f"循环时间：{loop_time:.4f}秒")
    print(f"推导式快了：{loop_time/comp_time:.2f}倍")

time_comparison()

# === 内存使用：列表 vs 生成器 ===
import sys

# 列表推导式（占用内存）
list_comp = [x**2 for x in range(1000)]
print(f"列表大小：{sys.getsizeof(list_comp)} 字节")

# 生成器表达式（节省内存）
gen_exp = (x**2 for x in range(1000))
print(f"生成器大小：{sys.getsizeof(gen_exp)} 字节")

# === 何时使用生成器 ===
def when_to_use_generator():
    """演示何时使用生成器"""
    
    # 大数据集 - 使用生成器
    def process_large_file():
        # 模拟处理大文件
        for i in range(1000000):
            if i % 100000 == 0:
                yield f"处理了 {i} 行"
    
    # 只获取前几个结果
    processor = process_large_file()
    for i, result in enumerate(processor):
        print(result)
        if i >= 2:  # 只要前3个结果
            break

when_to_use_generator()
```

## 总结

- **列表推导式**：`[expr for item in iterable if condition]`
- **字典推导式**：`{key: value for item in iterable if condition}`
- **集合推导式**：`{expr for item in iterable if condition}`
- **生成器表达式**：`(expr for item in iterable if condition)`
- **内置函数**：map, filter, zip, enumerate, sum, any, all
- **性能优势**：推导式通常比循环更快，生成器节省内存

推导式让 Python 代码更简洁、更高效，是 Python 编程的重要技能！
