// Includes --------------------------------------------------------------------
#include <node.h>
#include <v8.h>

#include <string>
#include <sstream>
#include <iterator>

using namespace v8;

// Dictionary parse ------------------------------------------------------------
void Parse(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();
    Local<Context> context = isolate->GetCurrentContext();

    // Set для записи слов
    Local<Set> Words = Local<Set>::Cast(args[1]);

    // Проверка на типы аргументов
    if (!args[0]->IsString()) {
        isolate->ThrowException(
            Exception::TypeError(
                String::NewFromUtf8(isolate, "Wrong type of first argument")
            )
        );

        return;
    }

    // Конвертим аргумент в строку
    String::Utf8Value arg(args[0]->ToString());
    std::string dictInput = std::string(*arg);

    // Создаём вектор
    std::stringstream ss;
    ss.str(dictInput);
    std::string item;

    // Перебираем вектор
    double DictSize = 0; // для подсчета количества строк
    while (std::getline(ss, item, '\n')) {
        DictSize++;
        Words->Add(context, String::NewFromUtf8(isolate, item.c_str()));
    }

    // Возвращаемый объект
    Local<Object> RetObject = Object::New(isolate);
    RetObject->Set(context, String::NewFromUtf8(isolate, "words"), Words);
    Local<String> NameSize = String::NewFromUtf8(isolate, "size");
    RetObject->Set(context, NameSize, Number::New(isolate, DictSize));

    // Возвращаем получившийся Set
    args.GetReturnValue().Set(RetObject);
}

// Module exports --------------------------------------------------------------
void Init(Local<Object> exports, Local<Object> module) {
    NODE_SET_METHOD(module, "exports", Parse);
}

NODE_MODULE(addon, Init)
