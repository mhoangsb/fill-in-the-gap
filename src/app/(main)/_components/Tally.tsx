export default function Tally({ label, value }: { label: string; value: number }) {
  const cellHeightPx = 80;
  const offsetY = -1 * (cellHeightPx * value);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-lg">{label}</div>
      <div className="aspect-square h-20 overflow-hidden border-2 border-dashed border-gray-600 text-5xl">
        <div
          className="-mt-0.5 flex flex-col transition-transform"
          style={{ transform: `translateY(${offsetY}px)` }}
        >
          <div className="grid aspect-square h-20 place-items-center">0</div>
          <div className="grid aspect-square h-20 place-items-center">1</div>
          <div className="grid aspect-square h-20 place-items-center">2</div>
          <div className="grid aspect-square h-20 place-items-center">3</div>
          <div className="grid aspect-square h-20 place-items-center">4</div>
          <div className="grid aspect-square h-20 place-items-center">5</div>
          <div className="grid aspect-square h-20 place-items-center">6</div>
          <div className="grid aspect-square h-20 place-items-center">7</div>
          <div className="grid aspect-square h-20 place-items-center">8</div>
          <div className="grid aspect-square h-20 place-items-center">9</div>
          <div className="grid aspect-square h-20 place-items-center">10</div>
          <div className="grid aspect-square h-20 place-items-center">11</div>
          <div className="grid aspect-square h-20 place-items-center">12</div>
          <div className="grid aspect-square h-20 place-items-center">13</div>
          <div className="grid aspect-square h-20 place-items-center">14</div>
          <div className="grid aspect-square h-20 place-items-center">15</div>
          <div className="grid aspect-square h-20 place-items-center">16</div>
          <div className="grid aspect-square h-20 place-items-center">17</div>
          <div className="grid aspect-square h-20 place-items-center">18</div>
          <div className="grid aspect-square h-20 place-items-center">19</div>
          <div className="grid aspect-square h-20 place-items-center">20</div>
          <div className="grid aspect-square h-20 place-items-center">21</div>
          <div className="grid aspect-square h-20 place-items-center">22</div>
          <div className="grid aspect-square h-20 place-items-center">23</div>
          <div className="grid aspect-square h-20 place-items-center">24</div>
          <div className="grid aspect-square h-20 place-items-center">25</div>
          <div className="grid aspect-square h-20 place-items-center">26</div>
          <div className="grid aspect-square h-20 place-items-center">27</div>
          <div className="grid aspect-square h-20 place-items-center">28</div>
          <div className="grid aspect-square h-20 place-items-center">29</div>
          <div className="grid aspect-square h-20 place-items-center">30</div>
          <div className="grid aspect-square h-20 place-items-center">31</div>
          <div className="grid aspect-square h-20 place-items-center">32</div>
          <div className="grid aspect-square h-20 place-items-center">33</div>
          <div className="grid aspect-square h-20 place-items-center">34</div>
          <div className="grid aspect-square h-20 place-items-center">35</div>
          <div className="grid aspect-square h-20 place-items-center">36</div>
          <div className="grid aspect-square h-20 place-items-center">37</div>
          <div className="grid aspect-square h-20 place-items-center">38</div>
          <div className="grid aspect-square h-20 place-items-center">39</div>
          <div className="grid aspect-square h-20 place-items-center">40</div>
          <div className="grid aspect-square h-20 place-items-center">41</div>
          <div className="grid aspect-square h-20 place-items-center">42</div>
          <div className="grid aspect-square h-20 place-items-center">43</div>
          <div className="grid aspect-square h-20 place-items-center">44</div>
          <div className="grid aspect-square h-20 place-items-center">45</div>
          <div className="grid aspect-square h-20 place-items-center">46</div>
          <div className="grid aspect-square h-20 place-items-center">47</div>
          <div className="grid aspect-square h-20 place-items-center">48</div>
          <div className="grid aspect-square h-20 place-items-center">49</div>
          <div className="grid aspect-square h-20 place-items-center">50</div>
        </div>
      </div>
    </div>
  );
}
