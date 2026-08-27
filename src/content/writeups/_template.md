---
title: "Tên bài — Tên giải"
ctf: "Tên giải 2026"
category: pwn            # pwn | web | crypto | rev | forensics | misc
difficulty: medium       # easy | medium | hard | insane
points: 350              # bỏ trống nếu giải không tính điểm
date: 2026-08-27         # YYYY-MM-DD, dùng để sắp xếp
tags: [heap, tcache, glibc-2.35]
summary: "Một hai câu tóm tắt lỗ hổng và hướng khai thác. Hiện trên thẻ ở trang danh sách."
draft: true              # true = không lên danh sách, nhưng mở thẳng URL vẫn xem được
---

## Recon

Mô tả file/binary/endpoint được cấp. Dán output `checksec`, `file`, header HTTP…

```bash
$ checksec --file=./chall
RELRO      STACK CANARY   NX        PIE
Full RELRO Canary found  NX enabled PIE enabled
```

## Lỗ hổng

Chỉ ra chính xác chỗ sai và tại sao nó khai thác được.

```c
void vuln() {
    char buf[64];
    read(0, buf, 72);   // off-by-8: ghi đè saved RBP
}
```

## Khai thác

Từng bước, kèm script.

```python
from pwn import *

io = remote('chall.example.ctf', 1337)
io.sendline(b'A' * 64 + p64(0xdeadbeef))
io.interactive()
```

## Flag

```
flag{vi_du_khong_phai_flag_that}
```

## Rút ra

Điều đáng nhớ cho lần sau.
