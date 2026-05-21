import torch


def solution(anchor, positive, negative, loss, B, E, margin):
    loss.copy_(
        torch.nn.functional.triplet_margin_loss(
            anchor,
            positive,
            negative,
            margin=margin,
            reduction="mean",
        )
    )
