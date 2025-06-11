# 异常处理

异常处理让程序能够优雅地处理错误情况，而不是直接崩溃。

## 基本异常处理

### try-except 结构

```python
# === 基本 try-except 结构 ===
try:
    number = int(input("请输入一个数字："))
    result = 10 / number
    print(f"10 ÷ {number} = {result}")
except ValueError:
    print("错误：输入的不是有效数字！")
except ZeroDivisionError:
    print("错误：不能除以零！")

# === 捕获多种异常 ===
def safe_divide(a, b):
    try:
        result = a / b
        return result
    except (ZeroDivisionError, TypeError) as e:
        print(f"计算错误：{e}")
        return None

print(safe_divide(10, 2))    # 5.0
print(safe_divide(10, 0))    # 计算错误：division by zero
print(safe_divide(10, "a"))  # 计算错误：unsupported operand type(s)

# === 捕获所有异常 ===
def risky_operation():
    try:
        # 一些可能出错的操作
        data = {"name": "Alice"}
        print(data["age"])  # KeyError
    except Exception as e:
        print(f"发生了未知错误：{type(e).__name__}: {e}")
        return False
    return True

risky_operation()

# === 完整的异常处理结构 ===
def complete_example():
    try:
        filename = "data.txt"
        with open(filename, "r") as file:
            content = file.read()
            number = int(content.strip())
            result = 100 / number
            print(f"结果：{result}")
    except FileNotFoundError:
        print(f"错误：文件 {filename} 不存在")
    except ValueError:
        print("错误：文件内容不是有效数字")
    except ZeroDivisionError:
        print("错误：文件中的数字是零")
    except Exception as e:
        print(f"未预期的错误：{e}")
    else:
        print("操作成功完成！")  # 只有没有异常时才执行
    finally:
        print("清理工作完成")    # 无论是否有异常都会执行

complete_example()
```

### 常见的内置异常

```python
# === 常见异常类型 ===

# ValueError：值错误
try:
    int("abc")  # 无法转换为整数
except ValueError as e:
    print(f"ValueError: {e}")

# TypeError：类型错误
try:
    "hello" + 5  # 字符串不能与数字相加
except TypeError as e:
    print(f"TypeError: {e}")

# KeyError：字典键不存在
try:
    data = {"name": "Alice"}
    print(data["age"])
except KeyError as e:
    print(f"KeyError: {e}")

# IndexError：索引超出范围
try:
    numbers = [1, 2, 3]
    print(numbers[10])
except IndexError as e:
    print(f"IndexError: {e}")

# AttributeError：属性不存在
try:
    text = "hello"
    text.append("world")  # 字符串没有append方法
except AttributeError as e:
    print(f"AttributeError: {e}")

# FileNotFoundError：文件不存在
try:
    with open("nonexistent.txt", "r") as file:
        content = file.read()
except FileNotFoundError as e:
    print(f"FileNotFoundError: {e}")

# ImportError：导入模块失败
try:
    import nonexistent_module
except ImportError as e:
    print(f"ImportError: {e}")
```

## 抛出异常

### 使用 raise 抛出异常

```python
# === 基本的 raise 用法 ===
def validate_age(age):
    if not isinstance(age, int):
        raise TypeError("年龄必须是整数")
    if age < 0:
        raise ValueError("年龄不能为负数")
    if age > 150:
        raise ValueError("年龄不能超过150岁")
    return True

# 测试异常抛出
try:
    validate_age(25)    # 正常
    validate_age(-5)    # ValueError
except ValueError as e:
    print(f"年龄验证失败：{e}")

# === 重新抛出异常 ===
def process_data(data):
    try:
        # 处理数据
        result = int(data) * 2
        return result
    except ValueError:
        print("数据处理失败，记录日志...")
        raise  # 重新抛出异常

try:
    process_data("abc")
except ValueError:
    print("在上层处理异常")

# === 抛出不同的异常 ===
def convert_temperature(temp, unit):
    if unit not in ["C", "F"]:
        raise ValueError(f"不支持的温度单位：{unit}")
    
    try:
        temp = float(temp)
    except ValueError:
        raise TypeError("温度必须是数字")
    
    if unit == "C":
        return temp * 9/5 + 32  # 摄氏转华氏
    else:
        return (temp - 32) * 5/9  # 华氏转摄氏

# 测试
try:
    result = convert_temperature("25", "C")
    print(f"转换结果：{result}")
    
    result = convert_temperature("abc", "C")
except (ValueError, TypeError) as e:
    print(f"转换失败：{e}")
```

## 自定义异常类

```python
# === 基本自定义异常 ===
class CustomError(Exception):
    """自定义异常类"""
    pass

class ValidationError(CustomError):
    """验证错误"""
    pass

class BusinessLogicError(CustomError):
    """业务逻辑错误"""
    pass

# === 带额外信息的自定义异常 ===
class BankError(Exception):
    """银行操作异常"""
    def __init__(self, message, error_code=None, account_id=None):
        super().__init__(message)
        self.error_code = error_code
        self.account_id = account_id

class InsufficientFundsError(BankError):
    """余额不足异常"""
    def __init__(self, account_id, balance, requested_amount):
        message = f"账户 {account_id} 余额不足：当前余额 {balance}，请求金额 {requested_amount}"
        super().__init__(message, "INSUFFICIENT_FUNDS", account_id)
        self.balance = balance
        self.requested_amount = requested_amount

# === 使用自定义异常 ===
class BankAccount:
    def __init__(self, account_id, balance=0):
        self.account_id = account_id
        self.balance = balance
    
    def withdraw(self, amount):
        if amount <= 0:
            raise BankError("取款金额必须大于零", "INVALID_AMOUNT", self.account_id)
        
        if amount > self.balance:
            raise InsufficientFundsError(self.account_id, self.balance, amount)
        
        self.balance -= amount
        return self.balance
    
    def deposit(self, amount):
        if amount <= 0:
            raise BankError("存款金额必须大于零", "INVALID_AMOUNT", self.account_id)
        
        self.balance += amount
        return self.balance

# 使用示例
account = BankAccount("12345", 100)

try:
    account.withdraw(50)
    print(f"取款成功，余额：{account.balance}")
    
    account.withdraw(80)  # 余额不足
except InsufficientFundsError as e:
    print(f"取款失败：{e}")
    print(f"错误代码：{e.error_code}")
    print(f"账户ID：{e.account_id}")
    print(f"当前余额：{e.balance}")
    print(f"请求金额：{e.requested_amount}")
except BankError as e:
    print(f"银行操作失败：{e}")
    print(f"错误代码：{e.error_code}")
```

## 异常处理的最佳实践

```python
# === 具体异常优于通用异常 ===
# 好的做法：捕获具体异常
def good_file_reader(filename):
    try:
        with open(filename, 'r') as file:
            return file.read()
    except FileNotFoundError:
        print(f"文件 {filename} 不存在")
    except PermissionError:
        print(f"没有权限读取文件 {filename}")
    except UnicodeDecodeError:
        print(f"文件 {filename} 编码错误")
    return None

# 不好的做法：捕获所有异常
def bad_file_reader(filename):
    try:
        with open(filename, 'r') as file:
            return file.read()
    except Exception:  # 太宽泛
        print("读取文件时出错")
    return None

# === 使用 finally 进行清理 ===
def process_file_with_cleanup(filename):
    file = None
    try:
        file = open(filename, 'r')
        data = file.read()
        # 处理数据
        result = data.upper()
        return result
    except FileNotFoundError:
        print(f"文件 {filename} 不存在")
        return None
    except Exception as e:
        print(f"处理文件时出错：{e}")
        return None
    finally:
        if file:
            file.close()
            print("文件已关闭")

# 更好的做法：使用 with 语句
def process_file_with_context(filename):
    try:
        with open(filename, 'r') as file:  # 自动处理文件关闭
            data = file.read()
            return data.upper()
    except FileNotFoundError:
        print(f"文件 {filename} 不存在")
        return None

# === 异常链 ===
def parse_config(config_string):
    try:
        import json
        return json.loads(config_string)
    except json.JSONDecodeError as e:
        # 抛出新异常，但保留原始异常信息
        raise ValueError(f"配置格式错误：{config_string}") from e

try:
    config = parse_config("invalid json")
except ValueError as e:
    print(f"错误：{e}")
    print(f"原因：{e.__cause__}")

# === 上下文管理器和异常 ===
class DatabaseConnection:
    def __init__(self, db_name):
        self.db_name = db_name
        self.connection = None
    
    def __enter__(self):
        print(f"连接到数据库 {self.db_name}")
        self.connection = f"connection_to_{self.db_name}"
        return self.connection
    
    def __exit__(self, exc_type, exc_value, traceback):
        print(f"关闭数据库连接 {self.db_name}")
        if exc_type:
            print(f"发生异常：{exc_type.__name__}: {exc_value}")
        return False  # 不抑制异常

# 使用上下文管理器
try:
    with DatabaseConnection("mydb") as conn:
        print(f"使用连接：{conn}")
        raise ValueError("模拟数据库错误")
except ValueError as e:
    print(f"捕获异常：{e}")

# === 日志记录异常 ===
import logging

# 配置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def divide_with_logging(a, b):
    try:
        result = a / b
        logger.info(f"除法运算成功：{a} / {b} = {result}")
        return result
    except ZeroDivisionError:
        logger.error(f"除零错误：{a} / {b}")
        raise
    except Exception as e:
        logger.exception(f"未预期的错误：{a} / {b}")  # 自动记录异常堆栈
        raise

# 测试
try:
    divide_with_logging(10, 2)
    divide_with_logging(10, 0)
except ZeroDivisionError:
    print("处理了除零错误")
```

## 调试和异常信息

```python
import traceback
import sys

# === 获取异常详细信息 ===
def detailed_error_handling():
    try:
        # 模拟嵌套函数调用中的错误
        def level1():
            def level2():
                def level3():
                    return 1 / 0
                return level3()
            return level2()
        
        level1()
    except Exception as e:
        print("=== 异常详细信息 ===")
        print(f"异常类型：{type(e).__name__}")
        print(f"异常消息：{e}")
        print(f"异常参数：{e.args}")
        
        print("\n=== 完整堆栈跟踪 ===")
        traceback.print_exc()
        
        print("\n=== 格式化堆栈跟踪 ===")
        tb_str = traceback.format_exc()
        print(tb_str)
        
        print("\n=== 异常信息对象 ===")
        exc_type, exc_value, exc_traceback = sys.exc_info()
        print(f"类型：{exc_type}")
        print(f"值：{exc_value}")
        print(f"跟踪：{exc_traceback}")

detailed_error_handling()

# === 自定义异常处理器 ===
def custom_exception_handler(exc_type, exc_value, exc_traceback):
    if issubclass(exc_type, KeyboardInterrupt):
        # 用户中断，正常退出
        print("\n程序被用户中断")
        return
    
    print("=== 未处理的异常 ===")
    print(f"类型：{exc_type.__name__}")
    print(f"消息：{exc_value}")
    traceback.print_exception(exc_type, exc_value, exc_traceback)

# 设置全局异常处理器
sys.excepthook = custom_exception_handler

# 测试（取消注释来测试）
# raise RuntimeError("这是一个测试异常")
```

## 总结

- **基本结构**：try-except-else-finally
- **异常类型**：ValueError, TypeError, KeyError 等内置异常
- **抛出异常**：raise 语句，重新抛出，异常链
- **自定义异常**：继承 Exception，添加额外信息
- **最佳实践**：具体异常，资源清理，日志记录
- **调试工具**：traceback 模块，异常详细信息

良好的异常处理让程序更加健壮，用户体验更好，也便于调试和维护！
