# 文件操作

文件操作是程序与外部数据交互的重要方式。

## 基本文件操作

### 读写文本文件

```python
# === 写入文件 ===
# 使用 with 语句（推荐，自动关闭文件）
with open("example.txt", "w", encoding="utf-8") as file:
    file.write("你好，世界！\n")
    file.write("这是第二行\n")
    file.write("Python 文件操作示例\n")

print("文件写入完成")

# === 读取整个文件 ===
try:
    with open("example.txt", "r", encoding="utf-8") as file:
        content = file.read()
        print("文件内容：")
        print(content)
except FileNotFoundError:
    print("文件不存在")

# === 逐行读取 ===
print("\n逐行读取：")
with open("example.txt", "r", encoding="utf-8") as file:
    for line_number, line in enumerate(file, 1):
        print(f"第{line_number}行：{line.strip()}")

# === 读取所有行到列表 ===
with open("example.txt", "r", encoding="utf-8") as file:
    lines = file.readlines()
    print(f"\n总共{len(lines)}行")
    for i, line in enumerate(lines):
        print(f"  {i+1}: {line.strip()}")

# === 追加内容 ===
with open("example.txt", "a", encoding="utf-8") as file:
    file.write("这是追加的内容\n")
    file.write("追加模式不会覆盖原内容\n")

print("内容追加完成")
```

### 文件模式详解

```python
# === 文件模式说明 ===
"""
文件模式：
'r'  - 只读（默认）
'w'  - 写入（覆盖原文件）
'a'  - 追加
'x'  - 创建新文件（如果文件已存在则失败）
'b'  - 二进制模式（如 'rb', 'wb'）
't'  - 文本模式（默认）
'+'  - 读写模式
"""

# === 不同模式示例 ===
# 创建新文件（如果已存在会报错）
try:
    with open("new_file.txt", "x", encoding="utf-8") as file:
        file.write("这是一个新文件")
    print("新文件创建成功")
except FileExistsError:
    print("文件已存在，无法创建")

# 读写模式
with open("example.txt", "r+", encoding="utf-8") as file:
    content = file.read()  # 先读取
    file.write("\n这是读写模式添加的内容")  # 再写入

# === 处理不同编码 ===
# 写入中文内容
chinese_text = "这是中文内容：你好，世界！"
with open("chinese.txt", "w", encoding="utf-8") as file:
    file.write(chinese_text)

# 读取时指定编码
with open("chinese.txt", "r", encoding="utf-8") as file:
    content = file.read()
    print(f"中文内容：{content}")

# 处理编码错误
try:
    with open("chinese.txt", "r", encoding="ascii") as file:
        content = file.read()
except UnicodeDecodeError as e:
    print(f"编码错误：{e}")
    
    # 使用错误处理策略
    with open("chinese.txt", "r", encoding="ascii", errors="ignore") as file:
        content = file.read()
        print(f"忽略错误后的内容：{content}")
```

## 二进制文件操作

```python
# === 二进制文件读写 ===
# 写入二进制数据
binary_data = b"Hello, World!"
with open("binary_file.bin", "wb") as file:
    file.write(binary_data)

# 读取二进制数据
with open("binary_file.bin", "rb") as file:
    data = file.read()
    print(f"二进制数据：{data}")
    print(f"解码为字符串：{data.decode('utf-8')}")

# === 复制文件（二进制方式）===
def copy_file(source, destination):
    """复制文件"""
    try:
        with open(source, "rb") as src:
            with open(destination, "wb") as dst:
                # 分块读取，适合大文件
                while True:
                    chunk = src.read(1024)  # 每次读取1KB
                    if not chunk:
                        break
                    dst.write(chunk)
        print(f"文件从 {source} 复制到 {destination}")
        return True
    except FileNotFoundError:
        print(f"源文件 {source} 不存在")
        return False
    except Exception as e:
        print(f"复制失败：{e}")
        return False

# 测试文件复制
copy_file("example.txt", "example_copy.txt")

# === 处理图片等二进制文件 ===
def get_file_info(filename):
    """获取文件信息"""
    try:
        with open(filename, "rb") as file:
            # 读取文件头部信息
            header = file.read(10)
            
            # 获取文件大小
            file.seek(0, 2)  # 移动到文件末尾
            size = file.tell()
            
            print(f"文件：{filename}")
            print(f"大小：{size} 字节")
            print(f"头部：{header}")
            
            # 检查文件类型（简单示例）
            file.seek(0)  # 回到文件开头
            if header.startswith(b'\x89PNG'):
                print("文件类型：PNG 图片")
            elif header.startswith(b'\xff\xd8'):
                print("文件类型：JPEG 图片")
            elif header.startswith(b'GIF'):
                print("文件类型：GIF 图片")
            else:
                print("文件类型：未知")
                
    except FileNotFoundError:
        print(f"文件 {filename} 不存在")

get_file_info("example.txt")
```

## 文件和目录操作

```python
import os
import shutil
from pathlib import Path

# === 使用 os 模块 ===
# 检查文件是否存在
if os.path.exists("example.txt"):
    print("文件存在")
    
    # 获取文件信息
    file_size = os.path.getsize("example.txt")
    print(f"文件大小：{file_size} 字节")
    
    # 获取文件修改时间
    import time
    mtime = os.path.getmtime("example.txt")
    print(f"修改时间：{time.ctime(mtime)}")

# 列出目录内容
current_dir = "."
print(f"\n当前目录 {current_dir} 的内容：")
for item in os.listdir(current_dir):
    full_path = os.path.join(current_dir, item)
    if os.path.isfile(full_path):
        size = os.path.getsize(full_path)
        print(f"  文件：{item} ({size} 字节)")
    elif os.path.isdir(full_path):
        print(f"  目录：{item}")

# 创建目录
test_dir = "test_directory"
if not os.path.exists(test_dir):
    os.makedirs(test_dir)
    print(f"创建目录：{test_dir}")

# 删除文件和目录
if os.path.exists("example_copy.txt"):
    os.remove("example_copy.txt")
    print("删除文件：example_copy.txt")

# === 使用 pathlib（现代方式）===
# 创建路径对象
file_path = Path("example.txt")

if file_path.exists():
    print(f"\n使用 pathlib：")
    print(f"文件名：{file_path.name}")
    print(f"文件扩展名：{file_path.suffix}")
    print(f"文件大小：{file_path.stat().st_size} 字节")
    print(f"父目录：{file_path.parent}")
    print(f"绝对路径：{file_path.absolute()}")
    
    # 读取文件
    content = file_path.read_text(encoding="utf-8")
    print(f"文件内容行数：{len(content.splitlines())}")

# 遍历目录
current_path = Path(".")
print(f"\n使用 pathlib 遍历目录：")
for item in current_path.iterdir():
    if item.is_file():
        print(f"  文件：{item.name}")
    elif item.is_dir():
        print(f"  目录：{item.name}")

# 查找特定文件
print(f"\n查找 .txt 文件：")
for txt_file in current_path.glob("*.txt"):
    print(f"  {txt_file}")

# 递归查找
print(f"\n递归查找 .py 文件：")
for py_file in current_path.rglob("*.py"):
    print(f"  {py_file}")
```

## CSV 文件操作

```python
import csv

# === 写入 CSV ===
students = [
    ["姓名", "年龄", "成绩"],
    ["张三", 20, 85],
    ["李四", 19, 92],
    ["王五", 21, 78]
]

with open("students.csv", "w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)
    writer.writerows(students)

print("CSV 文件写入完成")

# === 读取 CSV ===
print("\nCSV 文件内容：")
with open("students.csv", "r", encoding="utf-8") as file:
    reader = csv.reader(file)
    for row in reader:
        print(row)

# === 使用字典读取 CSV ===
with open("students.csv", "r", encoding="utf-8") as file:
    reader = csv.DictReader(file)
    print("\n使用字典读取：")
    for row in reader:
        print(f"姓名：{row['姓名']}, 年龄：{row['年龄']}, 成绩：{row['成绩']}")

# === 写入字典格式的 CSV ===
students_dict = [
    {"姓名": "赵六", "年龄": 22, "成绩": 88},
    {"姓名": "钱七", "年龄": 20, "成绩": 95},
]

with open("students_dict.csv", "w", newline="", encoding="utf-8") as file:
    fieldnames = ["姓名", "年龄", "成绩"]
    writer = csv.DictWriter(file, fieldnames=fieldnames)
    
    writer.writeheader()  # 写入表头
    writer.writerows(students_dict)

print("字典格式 CSV 写入完成")
```

## JSON 文件操作

```python
import json

# === 写入 JSON ===
data = {
    "students": [
        {"name": "Alice", "age": 20, "scores": [85, 92, 78]},
        {"name": "Bob", "age": 19, "scores": [88, 85, 90]},
        {"name": "Charlie", "age": 21, "scores": [92, 88, 85]}
    ],
    "course": "Python Programming",
    "semester": "2024春季"
}

with open("data.json", "w", encoding="utf-8") as file:
    json.dump(data, file, ensure_ascii=False, indent=2)

print("JSON 文件写入完成")

# === 读取 JSON ===
with open("data.json", "r", encoding="utf-8") as file:
    loaded_data = json.load(file)

print("\nJSON 文件内容：")
print(f"课程：{loaded_data['course']}")
print(f"学期：{loaded_data['semester']}")
print("学生信息：")
for student in loaded_data['students']:
    avg_score = sum(student['scores']) / len(student['scores'])
    print(f"  {student['name']}, {student['age']}岁, 平均分：{avg_score:.1f}")

# === 处理 JSON 字符串 ===
json_string = '{"name": "David", "age": 25, "city": "北京"}'
person = json.loads(json_string)
print(f"\n从字符串解析：{person}")

# 转换为 JSON 字符串
person_json = json.dumps(person, ensure_ascii=False)
print(f"转换为字符串：{person_json}")
```

## 文件操作的最佳实践

```python
# === 安全的文件操作 ===
def safe_file_operation(filename, operation="read"):
    """安全的文件操作函数"""
    try:
        if operation == "read":
            with open(filename, "r", encoding="utf-8") as file:
                return file.read()
        elif operation == "write":
            with open(filename, "w", encoding="utf-8") as file:
                file.write("测试内容")
                return True
    except FileNotFoundError:
        print(f"文件 {filename} 不存在")
    except PermissionError:
        print(f"没有权限访问文件 {filename}")
    except UnicodeDecodeError:
        print(f"文件 {filename} 编码错误")
    except Exception as e:
        print(f"文件操作失败：{e}")
    return None

# === 备份文件 ===
def backup_file(filename):
    """创建文件备份"""
    if not os.path.exists(filename):
        print(f"文件 {filename} 不存在")
        return False
    
    backup_name = f"{filename}.backup"
    try:
        shutil.copy2(filename, backup_name)  # 保留元数据
        print(f"备份创建成功：{backup_name}")
        return True
    except Exception as e:
        print(f"备份失败：{e}")
        return False

# === 临时文件 ===
import tempfile

def process_with_temp_file():
    """使用临时文件进行处理"""
    with tempfile.NamedTemporaryFile(mode='w+', delete=False, suffix='.txt') as temp_file:
        temp_filename = temp_file.name
        print(f"临时文件：{temp_filename}")
        
        # 写入临时文件
        temp_file.write("这是临时文件内容")
        temp_file.flush()
        
        # 读取临时文件
        temp_file.seek(0)
        content = temp_file.read()
        print(f"临时文件内容：{content}")
    
    # 清理临时文件
    os.unlink(temp_filename)
    print("临时文件已删除")

process_with_temp_file()

# === 文件锁定（简单示例）===
import fcntl  # Unix/Linux 系统

def write_with_lock(filename, content):
    """带锁定的文件写入"""
    try:
        with open(filename, "w") as file:
            fcntl.flock(file.fileno(), fcntl.LOCK_EX)  # 排他锁
            file.write(content)
            print(f"文件 {filename} 写入完成")
    except ImportError:
        print("文件锁定在此系统上不可用")
    except Exception as e:
        print(f"写入失败：{e}")
```

## 总结

- **基本操作**：读取、写入、追加，使用 with 语句
- **文件模式**：r/w/a/x，二进制/文本模式，编码处理
- **目录操作**：os 模块和 pathlib，文件信息获取
- **结构化数据**：CSV 和 JSON 文件处理
- **最佳实践**：异常处理、备份、临时文件、安全操作

掌握文件操作对于数据处理、配置管理、日志记录等任务都非常重要！
