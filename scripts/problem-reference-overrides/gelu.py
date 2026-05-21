import torch


def solution(input_tensor, output_tensor, n, m):
    output_tensor.copy_(
        torch.nn.functional.gelu(input_tensor, approximate="tanh")
    )
