function timer(start, end)
{
    return ((end - start) % (1000 * 60))/1000
}

module.exports = timer;
