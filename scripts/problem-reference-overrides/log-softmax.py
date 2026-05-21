import torch


def solution(input, output, M, N):
    output.copy_(torch.nn.functional.log_softmax(input.view(M, N), dim=1))
