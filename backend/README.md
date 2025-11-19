# fashion-mnist classifier backend

## setup
-----
create and activate virtual environment
python -m venv bck_fashionml3_env
bck_fashionml3_env\Scripts\activate
# or
bck_fashionml3_env\Scripts\Activate.ps1

## install required packages
-----------------------------
pip install numpy==2.2.6
pip install pandas==2.3.3
pip install scipy==1.14.1
pip install matplotlib==3.10.7
pip install seaborn==0.13.2
pip install scikit-learn==1.7.2
pip install tensorflow==2.20.0
pip install torch==2.9.1+cpu
pip install opencv-python
pip install flask flask-cors pillow


## verify install
---------------------
python -c "import numpy,pandas,scipy,matplotlib,seaborn,sklearn,tensorflow,torch; print(numpy.__version__,pandas.__version__,scipy.__version__,matplotlib.__version__,seaborn.__version__,sklearn.__version__,tensorflow.__version__,torch.__version__)"

## run backend
----------------
bck_fashionml3_env\Scripts\Activate.ps1
python app.py
# or
.\bck_fashionml3_env\Scripts\python.exe app.py

## alternative
----------------
pip install -r requirements.txt

## model info
------------------
architecture — fully connected network

framework — tensorflow keras

input — 28x28 grayscale

output — 10 classes

label	class
0	t-shirt top
1	trouser
2	pullover
3	dress
4	coat
5	sandal
6	shirt
7	sneaker
8	bag
9	ankle boot


## dataset notes
------------------
### fashion-mnist style

    white clothing on black background
    centered
    28×28
    thin outlines
    grayscale
    no noise


### your images

    dark clothing on white background
    large rgb photos
    shadows
    strong edges
    wrong scale
    different contrast

## result
    models trained on fashion-mnist fail on real photos without preprocessing.

## recommended preprocessing

    convert rgb to grayscale
    invert colors
    center object
    resize to 28×28
    equalize contrast
    smooth edges