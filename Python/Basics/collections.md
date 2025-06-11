# 集合类型

Python 提供了几种内置的集合类型来存储多个值：列表、字典、元组和集合。

## 列表 (List)：有序、可变的集合

列表是 Python 中最常用的数据结构之一。

### 创建和基本操作

```python
# === 创建列表 ===
# 空列表
empty_list = []
also_empty = list()

# 包含元素的列表
fruits = ["苹果", "香蕉", "橙子"]
numbers = [1, 2, 3, 4, 5]
mixed = ["文本", 42, True, 3.14, None]  # 可以包含不同类型

# 使用 range 创建数字列表
numbers = list(range(10))        # [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
evens = list(range(0, 10, 2))    # [0, 2, 4, 6, 8]

# === 访问元素 ===
fruits = ["苹果", "香蕉", "橙子", "葡萄", "梨"]
print(f"列表：{fruits}")

# 索引访问（从0开始）
print(f"第一个水果：{fruits[0]}")     # "苹果"
print(f"最后一个水果：{fruits[-1]}")   # "梨"
print(f"倒数第二个：{fruits[-2]}")     # "葡萄"

# 切片访问
print(f"前三个：{fruits[:3]}")        # ["苹果", "香蕉", "橙子"]
print(f"后两个：{fruits[-2:]}")       # ["葡萄", "梨"]
print(f"中间的：{fruits[1:4]}")       # ["香蕉", "橙子", "葡萄"]
print(f"每隔一个：{fruits[::2]}")     # ["苹果", "橙子", "梨"]
print(f"反转：{fruits[::-1]}")        # ["梨", "葡萄", "橙子", "香蕉", "苹果"]
```

### 修改列表

```python
fruits = ["苹果", "香蕉", "橙子"]
print(f"原始列表：{fruits}")

# === 添加元素 ===
# append：在末尾添加一个元素
fruits.append("葡萄")
print(f"添加葡萄后：{fruits}")

# insert：在指定位置插入元素
fruits.insert(1, "草莓")  # 在索引1的位置插入
print(f"插入草莓后：{fruits}")

# extend：添加多个元素（扩展列表）
fruits.extend(["梨", "桃子"])
print(f"扩展后：{fruits}")

# 也可以用 += 操作符
fruits += ["樱桃", "芒果"]
print(f"用+=添加后：{fruits}")

# === 删除元素 ===
# remove：删除第一个匹配的值
fruits.remove("香蕉")
print(f"删除香蕉后：{fruits}")

# pop：删除并返回指定位置的元素（默认最后一个）
last_fruit = fruits.pop()
print(f"弹出的水果：{last_fruit}")
print(f"弹出后的列表：{fruits}")

first_fruit = fruits.pop(0)
print(f"弹出的第一个：{first_fruit}")
print(f"弹出后的列表：{fruits}")

# del：删除指定位置或切片
del fruits[1]  # 删除索引1的元素
print(f"删除索引1后：{fruits}")

# clear：清空列表
backup = fruits.copy()  # 先备份
fruits.clear()
print(f"清空后：{fruits}")
fruits = backup  # 恢复

# === 修改元素 ===
fruits[0] = "红苹果"  # 修改单个元素
print(f"修改第一个后：{fruits}")

fruits[1:3] = ["黄香蕉", "橙橙子"]  # 修改切片
print(f"修改切片后：{fruits}")
```

### 列表的实用方法

```python
numbers = [3, 1, 4, 1, 5, 9, 2, 6, 5]
fruits = ["banana", "apple", "cherry", "apple"]

print(f"数字列表：{numbers}")
print(f"水果列表：{fruits}")

# === 查找和计数 ===
print(f"数字1的位置：{numbers.index(1)}")        # 第一次出现的位置
print(f"数字1出现次数：{numbers.count(1)}")       # 出现次数
print(f"apple出现次数：{fruits.count('apple')}")  # 2

# 检查元素是否存在
print(f"5在列表中吗？{5 in numbers}")           # True
print(f"10在列表中吗？{10 in numbers}")         # False

# === 排序 ===
# sort：就地排序（修改原列表）
numbers_copy = numbers.copy()
numbers_copy.sort()
print(f"升序排序：{numbers_copy}")

numbers_copy.sort(reverse=True)
print(f"降序排序：{numbers_copy}")

# sorted：返回新的排序列表（不修改原列表）
sorted_numbers = sorted(numbers)
print(f"原列表：{numbers}")
print(f"排序后的新列表：{sorted_numbers}")

# 字符串排序
sorted_fruits = sorted(fruits)
print(f"按字母排序的水果：{sorted_fruits}")

# === 反转 ===
# reverse：就地反转
numbers_copy = numbers.copy()
numbers_copy.reverse()
print(f"反转后：{numbers_copy}")

# 或者使用切片
reversed_numbers = numbers[::-1]
print(f"切片反转：{reversed_numbers}")

# === 其他有用操作 ===
print(f"列表长度：{len(numbers)}")
print(f"最大值：{max(numbers)}")
print(f"最小值：{min(numbers)}")
print(f"总和：{sum(numbers)}")

# 复制列表
shallow_copy = numbers.copy()  # 浅拷贝
also_shallow = numbers[:]      # 切片也是浅拷贝
also_shallow2 = list(numbers)  # 构造函数也是浅拷贝

# 深拷贝（当列表包含可变对象时需要）
import copy
deep_copy = copy.deepcopy(numbers)
```

## 字典 (Dictionary)：键值对的集合

字典是 Python 中另一个非常重要的数据结构。

### 创建和基本操作

```python
# === 创建字典 ===
# 空字典
empty_dict = {}
also_empty = dict()

# 包含数据的字典
student = {
    "name": "小明",
    "age": 20,
    "grade": "大二",
    "scores": [85, 92, 78],
    "is_active": True
}

# 使用 dict() 构造函数
person = dict(name="Alice", age=25, city="北京")
print(f"学生信息：{student}")
print(f"个人信息：{person}")

# 从键值对列表创建
pairs = [("a", 1), ("b", 2), ("c", 3)]
dict_from_pairs = dict(pairs)
print(f"从配对创建：{dict_from_pairs}")

# === 访问值 ===
print(f"学生姓名：{student['name']}")        # 直接访问
print(f"学生年龄：{student.get('age')}")     # 使用 get 方法

# get 方法的优势：可以提供默认值，避免 KeyError
print(f"电话号码：{student.get('phone', '未提供')}")  # 键不存在时返回默认值

# 检查键是否存在
if "email" in student:
    print(f"邮箱：{student['email']}")
else:
    print("没有邮箱信息")
```

### 修改字典

```python
student = {"name": "小明", "age": 20}
print(f"原始字典：{student}")

# === 添加和修改 ===
student["grade"] = "大二"        # 添加新键值对
student["age"] = 21              # 修改现有值
student["hobbies"] = ["读书", "游泳", "编程"]  # 添加列表值

print(f"修改后：{student}")

# update：批量更新
new_info = {
    "city": "北京",
    "major": "计算机科学",
    "age": 22  # 会覆盖现有的 age
}
student.update(new_info)
print(f"批量更新后：{student}")

# === 删除 ===
# del：删除指定键
del student["age"]
print(f"删除年龄后：{student}")

# pop：删除并返回值
grade = student.pop("grade")
print(f"弹出的年级：{grade}")
print(f"弹出后的字典：{student}")

# pop 带默认值
phone = student.pop("phone", "无电话")
print(f"弹出的电话：{phone}")

# popitem：删除并返回最后插入的键值对（Python 3.7+保证顺序）
if student:
    key, value = student.popitem()
    print(f"弹出的最后一项：{key} = {value}")

# clear：清空字典
backup = student.copy()
student.clear()
print(f"清空后：{student}")
student = backup  # 恢复
```

### 字典的方法和操作

```python
student = {
    "name": "小红",
    "age": 19,
    "major": "数学",
    "scores": {"数学": 95, "英语": 87, "物理": 92}
}

print(f"学生信息：{student}")

# === 获取键、值、项 ===
keys = student.keys()
values = student.values()
items = student.items()

print(f"所有键：{list(keys)}")
print(f"所有值：{list(values)}")
print(f"所有项：{list(items)}")

# === 遍历字典 ===
print("\n=== 遍历方式 ===")

# 遍历键
print("遍历键：")
for key in student:
    print(f"  {key}: {student[key]}")

# 遍历键值对（推荐）
print("\n遍历键值对：")
for key, value in student.items():
    print(f"  {key}: {value}")

# 遍历值
print("\n遍历值：")
for value in student.values():
    print(f"  {value}")

# === 嵌套字典 ===
students = {
    "001": {
        "name": "张三",
        "age": 20,
        "scores": {"数学": 95, "英语": 87}
    },
    "002": {
        "name": "李四",
        "age": 19,
        "scores": {"数学": 88, "英语": 92}
    }
}

# 访问嵌套数据
print(f"\n学生001的数学成绩：{students['001']['scores']['数学']}")

# 安全访问嵌套数据
math_score = students.get("003", {}).get("scores", {}).get("数学", "无数据")
print(f"学生003的数学成绩：{math_score}")
```

## 元组 (Tuple)：不可变的序列

元组类似列表，但是不可变：

```python
# === 创建元组 ===
# 空元组
empty_tuple = ()
also_empty = tuple()

# 包含元素的元组
coordinates = (3, 4)
colors = ("red", "green", "blue")
mixed = ("Alice", 25, True, 3.14)

# 单元素元组（注意逗号）
single = (42,)  # 没有逗号就不是元组
print(f"单元素元组：{single}, 类型：{type(single)}")

not_tuple = (42)  # 这只是括号，不是元组
print(f"不是元组：{not_tuple}, 类型：{type(not_tuple)}")

# 不用括号也可以创建元组
point = 1, 2, 3
print(f"坐标点：{point}, 类型：{type(point)}")

# === 访问元组 ===
person = ("Alice", 25, "Engineer")
print(f"姓名：{person[0]}")
print(f"年龄：{person[1]}")
print(f"职业：{person[2]}")

# 元组解包（非常有用）
name, age, job = person
print(f"解包结果：姓名={name}, 年龄={age}, 职业={job}")

# 交换变量（利用元组）
a, b = 10, 20
print(f"交换前：a={a}, b={b}")
a, b = b, a
print(f"交换后：a={a}, b={b}")

# === 元组的方法 ===
numbers = (1, 2, 3, 2, 4, 2, 5)
print(f"数字元组：{numbers}")
print(f"2出现的次数：{numbers.count(2)}")
print(f"3第一次出现的位置：{numbers.index(3)}")

# === 元组的用途 ===
# 1. 函数返回多个值
def get_name_age():
    return "Bob", 30

name, age = get_name_age()
print(f"函数返回：{name}, {age}")

# 2. 作为字典的键（因为不可变）
locations = {
    (0, 0): "原点",
    (1, 0): "x轴上的点",
    (0, 1): "y轴上的点"
}
print(f"原点：{locations[(0, 0)]}")

# 3. 配置数据（不希望被修改）
DATABASE_CONFIG = ("localhost", 5432, "mydb", "user", "password")
host, port, database, username, password = DATABASE_CONFIG
```

## 集合 (Set)：无序、不重复的集合

```python
# === 创建集合 ===
# 空集合（注意不能用 {}，那是字典）
empty_set = set()

# 包含元素的集合
fruits = {"apple", "banana", "orange"}
numbers = {1, 2, 3, 4, 5}

# 从列表创建集合（自动去重）
list_with_duplicates = [1, 2, 2, 3, 3, 3, 4]
unique_numbers = set(list_with_duplicates)
print(f"去重后：{unique_numbers}")  # {1, 2, 3, 4}

# === 集合操作 ===
set1 = {1, 2, 3, 4}
set2 = {3, 4, 5, 6}

print(f"集合1：{set1}")
print(f"集合2：{set2}")

# 并集
print(f"并集：{set1 | set2}")        # {1, 2, 3, 4, 5, 6}
print(f"并集：{set1.union(set2)}")   # 同上

# 交集
print(f"交集：{set1 & set2}")              # {3, 4}
print(f"交集：{set1.intersection(set2)}")  # 同上

# 差集
print(f"差集：{set1 - set2}")              # {1, 2}
print(f"差集：{set1.difference(set2)}")    # 同上

# 对称差集
print(f"对称差集：{set1 ^ set2}")                      # {1, 2, 5, 6}
print(f"对称差集：{set1.symmetric_difference(set2)}")  # 同上

# === 集合方法 ===
fruits = {"apple", "banana"}

# 添加元素
fruits.add("orange")
print(f"添加后：{fruits}")

# 添加多个元素
fruits.update(["grape", "kiwi"])
print(f"批量添加后：{fruits}")

# 删除元素
fruits.remove("banana")  # 如果元素不存在会报错
print(f"删除后：{fruits}")

fruits.discard("mango")  # 如果元素不存在不会报错
print(f"安全删除后：{fruits}")

# 弹出随机元素
if fruits:
    popped = fruits.pop()
    print(f"弹出的元素：{popped}")
    print(f"剩余元素：{fruits}")

# 清空集合
fruits.clear()
print(f"清空后：{fruits}")
```

## 总结

- **列表 (list)**：有序、可变，支持索引和切片，适合存储序列数据
- **字典 (dict)**：键值对映射，无序（Python 3.7+保持插入顺序），适合存储关联数据
- **元组 (tuple)**：有序、不可变，适合存储不变的数据，可作为字典键
- **集合 (set)**：无序、不重复，适合去重和集合运算

选择合适的集合类型对程序的性能和可读性都很重要！
