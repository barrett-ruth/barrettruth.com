def minimumSubarrayLength(self, nums, k):
    # provide a sentinel for "no window found"
    ans = sys.maxsize
    window = deque()
    l = 0

    # expand the window by default
    for r in range(len(nums)):
        # consider `nums[r]`
        window.append(nums[r])
        # shrink window while valid
        while l <= r and reduce(operator.or_, window) >= k:
            ans = min(ans, r - l + 1)
            window.popleft()
            l += 1

    # normalize to -1 as requested
    return -1 if ans == sys.maxsize else ans
